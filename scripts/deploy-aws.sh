#!/usr/bin/env bash
# Deploys the committed HEAD to the AWS Lightsail server (Stockholm, eu-north-1, 13.62.200.190).
#
# The server has 1 GB RAM, too little for `next build`, so the site is built here (Git Bash on Windows) and
# only the result is uploaded:
#   1. export HEAD to a temp folder, open an SSH tunnel to the server's PostgreSQL;
#   2. npm ci + npm run build there, with the server's env (the build applies pending migrations to the
#      server database and prerenders pages from it);
#   3. upload code + .next as a new release, reuse node_modules when package-lock.json did not change
#      (otherwise npm ci on the server), rewrite the PC paths (scripts/aws-fix-paths.py);
#   4. point /home/tao/app at the release, restart, check the site answers, keep the last 3 releases.
# If any step before 4 fails, the running site is not touched. Needs the SSH key ~/.ssh/tao_lightsail.
#
# Usage (from the project folder):  bash scripts/deploy-aws.sh
set -euo pipefail

HOST=${TAO_HOST:-ubuntu@13.62.200.190}
KEY=${TAO_KEY:-$HOME/.ssh/tao_lightsail}
PORT=${TAO_TUNNEL_PORT:-54329}
MARK=tao-build-src
SSH="ssh -i $KEY -o ConnectTimeout=15"

if [ -n "$(git status --porcelain)" ]; then
  echo "Uncommitted changes: commit first (only committed code is deployed)." >&2
  exit 1
fi
SHA=$(git rev-parse --short HEAD)
REL=/home/tao/releases/$SHA-$(date +%Y%m%d-%H%M%S)
WORK=$(mktemp -d)
SRC=$WORK/$MARK
CTL=$WORK/tunnel.sock
cleanup() {
  $SSH -S "$CTL" -O exit "$HOST" >/dev/null 2>&1 || true
  rm -rf "$WORK"
}
trap cleanup EXIT

echo "== $SHA: building locally"
mkdir -p "$SRC"
git archive --format=tar HEAD | tar -x -C "$SRC"
cp scripts/aws-fix-paths.py "$WORK/"
(
  umask 077
  $SSH "$HOST" 'sudo grep -v "^DATABASE_URL=" /home/tao/secrets/app.env' > "$SRC/.env"
  echo "DATABASE_URL=postgresql://tao:$($SSH "$HOST" 'sudo cat /home/tao/secrets/dbpass')@127.0.0.1:$PORT/tao" >> "$SRC/.env"
)
$SSH -f -N -M -S "$CTL" -o ExitOnForwardFailure=yes -L "$PORT:127.0.0.1:5432" "$HOST"
(
  cd "$SRC"
  npm ci --no-audit --no-fund --loglevel=error
  set -a; . ./.env; set +a
  npm run build
)
rm "$SRC/.env"

echo "== uploading release $SHA"
# everything except the top-level node_modules (the server has its own); .next/node_modules must go along
(cd "$SRC" && tar -c --exclude=.next/cache $(ls -A | grep -vx node_modules)) | \
  $SSH "$HOST" "sudo -u tao bash -c 'rm -rf $REL && mkdir -p $REL && tar -x -C $REL'"
cat "$WORK/aws-fix-paths.py" | $SSH "$HOST" "sudo tee /home/tao/aws-fix-paths.py >/dev/null"

echo "== installing on the server"
$SSH "$HOST" "sudo -u tao bash -c 'set -e; cd $REL; ln -sf /home/tao/secrets/app.env .env
  if [ -d /home/tao/app/node_modules ] && cmp -s package-lock.json /home/tao/app/package-lock.json; then
    cp -al /home/tao/app/node_modules node_modules; echo node_modules reused
  else
    npm ci --no-audit --no-fund --loglevel=error
  fi
  python3 /home/tao/aws-fix-paths.py $REL $MARK'"

echo "== switching"
PREV=$($SSH "$HOST" "readlink /home/tao/app")
$SSH "$HOST" "sudo -u tao ln -sfn $REL /home/tao/app && sudo systemctl restart tao-web"

for i in $(seq 1 30); do
  code=$($SSH "$HOST" "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/" || true)
  if [ "$code" = 200 ]; then
    $SSH "$HOST" "sudo bash -c 'ls -1dt /home/tao/releases/* | tail -n +4 | xargs -r rm -rf'"
    echo "== live: $SHA"
    exit 0
  fi
  sleep 2
done
echo "Site did not answer 200 (last: $code): rolling back to $PREV" >&2
$SSH "$HOST" "sudo -u tao ln -sfn $PREV /home/tao/app && sudo systemctl restart tao-web"
echo "Rolled back. Logs: sudo journalctl -u tao-web -n 50" >&2
exit 1
