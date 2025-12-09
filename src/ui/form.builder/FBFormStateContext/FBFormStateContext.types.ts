import { Dispatch, SetStateAction } from 'react';
import { ChangeRequestUpdateContainerProps } from '../../change.request/ChangeRequestUpdate.container';
import { DocumentRevisionUpdateContainerProps } from '../../documentRevision/DocumentRevisionUpdate.container';
import FBFormState from '../FBForm/FBForm.state';

export interface FBFormStateContextProps {
  values: FBFormState['values']
  setValues: Dispatch<SetStateAction<FBFormState['values']>>
}

export type FBFormStateContextWrapperProps = DocumentRevisionUpdateContainerProps & ChangeRequestUpdateContainerProps;
