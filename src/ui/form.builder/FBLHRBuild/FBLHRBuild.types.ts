import { FBProviderProps, FBRadioGroupProps } from '..';
import { SMDialogHOCProps, SMDialogProps } from '../../../App';
import { Nullable } from '../../../state/ducks/common/types';

export type FBLHRBuildProps =
& FBRadioGroupProps
& SMDialogHOCProps
& Pick<FBProviderProps, 'lhrBuildState'>
& Pick<SMDialogProps, 'onDialogActionClick'>
& {
  buildValidationRules: Nullable<string>;
};

export interface FBLHRBuildConstructor {
  value?: string;
  disabled?: boolean;
}

export enum FBLHRBuildOptions {
  'R&D' = 'R&D',
  Production = 'Production'
}
