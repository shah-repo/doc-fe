import React from 'react';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import FBMaterialDispositionTable from './components/FBMaterialDispositionTable';

interface props {
  changeRequest?: ChangeRequest
  isShowOnly?: boolean
  isAdditionalColumnsShown?: boolean
  setDoNotPrompt?: (state: boolean) => void
}

const FBMaterialDisposition: React.FunctionComponent<props> = ({ changeRequest, isShowOnly, isAdditionalColumnsShown, setDoNotPrompt }) => {
  return (
    <>
      <FBMaterialDispositionTable
        {...{ changeRequest, isShowOnly, setDoNotPrompt }}
      />
    </>
  );
};

export default FBMaterialDisposition;
