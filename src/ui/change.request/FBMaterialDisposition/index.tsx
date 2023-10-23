import React from 'react';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import FBMaterialDispositionTable from './components/FBMaterialDispositionTable';
import FBTasksListTable from './components/FBTasksListTable';

interface props {
  changeRequest?: ChangeRequest
  isShowOnly?: boolean
  showAdditionalColumns?: boolean
}

const FBMaterialDisposition: React.FunctionComponent<props> = ({ changeRequest, isShowOnly, showAdditionalColumns }) => {
  return (<>
    <FBMaterialDispositionTable {...{ changeRequest, isShowOnly }} />
    <FBTasksListTable {...{ changeRequest, isShowOnly, showAdditionalColumns }} />
  </>);
};

export default FBMaterialDisposition;
