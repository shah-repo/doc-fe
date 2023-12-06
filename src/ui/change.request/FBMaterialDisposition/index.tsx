import React from 'react';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import FBMaterialDispositionTable from './components/FBMaterialDispositionTable';
import FBTasksListTable from './components/FBTasksListTable';

interface props {
  changeRequest?: ChangeRequest
  isShowOnly?: boolean
  isAdditionalColumnsShown?: boolean
  setDoNotPrompt?: (state: boolean) => void
}

const FBMaterialDisposition: React.FunctionComponent<props> = ({ changeRequest, isShowOnly, isAdditionalColumnsShown, setDoNotPrompt }) => {
  return (<>
    <FBMaterialDispositionTable {...{ changeRequest, isShowOnly, setDoNotPrompt }} />
    { changeRequest && <FBTasksListTable {
      ...{ partOfId: changeRequest.id, state: changeRequest.state, isShowOnly, isAdditionalColumnsShown, setDoNotPrompt }} />
    }
  </>);
};

export default FBMaterialDisposition;
