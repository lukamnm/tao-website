import * as migration_20261025_201257_baseline from './20261025_201257_baseline';
import * as migration_20261030_110141_admin_lists from './20261030_110141_admin_lists';

export const migrations = [
  {
    up: migration_20261025_201257_baseline.up,
    down: migration_20261025_201257_baseline.down,
    name: '20261025_201257_baseline',
  },
  {
    up: migration_20261030_110141_admin_lists.up,
    down: migration_20261030_110141_admin_lists.down,
    name: '20261030_110141_admin_lists'
  },
];
