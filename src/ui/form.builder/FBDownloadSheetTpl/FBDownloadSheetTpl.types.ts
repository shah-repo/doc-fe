import { FBInputProps, FBProviderProps } from '..';

export type FBDownloadSheetTplProps =
& Pick<FBInputProps, 'name' | 'label' | 'disabled'>
& Pick<FBProviderProps, 'downloadSheetTplState' >
& {
  handleAction?: () => any;
};
