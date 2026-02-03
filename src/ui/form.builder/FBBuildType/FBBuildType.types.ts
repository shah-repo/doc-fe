import { FBAutocompleteAsyncProps } from '..';
import { LHRBuild } from '../../administration/general.settings/panels/LHRBuild/types';

export type FBBuildTypeProps = FBAutocompleteAsyncProps & {
  selectedValue?: LHRBuild
  defaultValue?: LHRBuild
  prevValue?: LHRBuild
  options?: LHRBuild[]
  isDialogOpen?: boolean
  onChange?: (event: React.ChangeEvent<{}>, inputValue: string) => void
  onDialogActionClick?: (action: 'cancel' | 'confirm') => void
  refresh?: boolean
  isDisabled?: boolean
};
