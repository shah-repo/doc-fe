import { FBControlPickerState, FBEditorHelperProps, FBInputProps, FBInputType } from '..';

export type FBControlPickerProps =
& FBEditorHelperProps
& Pick<FBInputProps, 'index'>
& {
  controlPickerState?: FBControlPickerState;
  pickers?: FBControlPickerDataProps;
};

type FBControlPickerType =
| 'section'
| 'inputs'
| 'approvals'
| 'customcontrols'
| 'buttons'
| 'instructions'
| 'actions'
| 'favourites';

export interface FBFavouritesBody {
  fbComponent: string;
}
interface Favourites {
  companyId: string;
  createdAt: string;
  employeeId: string;
  fbComponent: string;
  id: string;
  updatedAt: string;
}
export interface FBFavouritesResponse {
  results: Favourites[];
  page_total: number;
  total: number;
}
export type FBControlPickerDataProps = Partial<Record<FBControlPickerType, FBInputType[]>>;
