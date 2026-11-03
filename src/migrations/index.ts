import * as migration_20261025_201257_baseline from './20261025_201257_baseline';
import * as migration_20261030_110141_admin_lists from './20261030_110141_admin_lists';
import * as migration_20261030_130045_design_v2 from './20261030_130045_design_v2';
import * as migration_20261030_130100_design_v2_data from './20261030_130100_design_v2_data';
import * as migration_20261103_131022_design_v4 from './20261103_131022_design_v4';
import * as migration_20261103_131100_design_v4_data from './20261103_131100_design_v4_data';

export const migrations = [
  {
    up: migration_20261025_201257_baseline.up,
    down: migration_20261025_201257_baseline.down,
    name: '20261025_201257_baseline',
  },
  {
    up: migration_20261030_110141_admin_lists.up,
    down: migration_20261030_110141_admin_lists.down,
    name: '20261030_110141_admin_lists',
  },
  {
    up: migration_20261030_130045_design_v2.up,
    down: migration_20261030_130045_design_v2.down,
    name: '20261030_130045_design_v2',
  },
  {
    up: migration_20261030_130100_design_v2_data.up,
    down: migration_20261030_130100_design_v2_data.down,
    name: '20261030_130100_design_v2_data',
  },
  {
    up: migration_20261103_131022_design_v4.up,
    down: migration_20261103_131022_design_v4.down,
    name: '20261103_131022_design_v4'
  },
  {
    up: migration_20261103_131100_design_v4_data.up,
    down: migration_20261103_131100_design_v4_data.down,
    name: '20261103_131100_design_v4_data',
  },
];
