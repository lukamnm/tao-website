"""Runs on the server after a release is uploaded (called by scripts/deploy-aws.sh).

The site is built on a Windows PC, not on the server (1 GB RAM is too little for `next build`), so the build
output still points at the PC's build folder in two places:
  - .next/node_modules/* are symlinks (Turbopack's external packages) with absolute targets;
  - .next/required-server-files.json/.js hold the absolute project path.
Both are rewritten to the release folder. Only path strings are touched.

Usage: python3 aws-fix-paths.py <release dir> <build folder name>
"""
import json
import os
import re
import sys

release, marker = sys.argv[1], sys.argv[2]
BS = chr(92)

fixed = broken = 0
for root, dirs, files in os.walk(os.path.join(release, '.next', 'node_modules')):
    for name in dirs + files:
        link = os.path.join(root, name)
        if not os.path.islink(link):
            continue
        target = os.readlink(link).replace(BS, '/')
        i = target.find('/' + marker + '/')
        if i < 0:
            continue
        new = os.path.join(release, target[i + len(marker) + 2:])
        os.unlink(link)
        os.symlink(new, link)
        fixed += 1
        if not os.path.exists(new):
            broken += 1
            print('missing link target:', new)

PATH = re.compile(r'[A-Za-z]:(?:' + re.escape(BS) + r'|/)[^"\']*')


def fix(m):
    v = m.group(0).replace(BS + BS, '/').replace(BS, '/')
    i = v.find('/' + marker)
    return release + v[i + len(marker) + 1:] if i >= 0 else v


for f in ('required-server-files.json', 'required-server-files.js'):
    p = os.path.join(release, '.next', f)
    if os.path.exists(p):
        s = open(p, encoding='utf-8').read()
        open(p, 'w', encoding='utf-8').write(PATH.sub(fix, s))

app_dir = json.load(open(os.path.join(release, '.next', 'required-server-files.json'))).get('appDir')
print(f'links fixed: {fixed}, missing: {broken}, appDir: {app_dir}')
sys.exit(1 if broken or app_dir != release else 0)
