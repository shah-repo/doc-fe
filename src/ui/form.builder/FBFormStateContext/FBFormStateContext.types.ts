import { Dispatch, SetStateAction } from 'react';
import FBFormState from '../FBForm/FBForm.state';

export interface FBFormStateContextProps {
  values: FBFormState['values']
  setValues: Dispatch<SetStateAction<FBFormState['values']>>
}
