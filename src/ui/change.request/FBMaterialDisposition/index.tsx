import React from 'react';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import FBMaterialDispositionTable from './components/FBMaterialDispositionTable';
import FBTasksListTable from './components/FBTasksListTable';

interface props {
  changeRequest?: ChangeRequest
  isShowOnly?: boolean
  isAdditionalColumnsShown?: boolean
}

const FBMaterialDisposition: React.FunctionComponent<props> = ({ changeRequest, isShowOnly, isAdditionalColumnsShown }) => {
  return (<>
    <FBMaterialDispositionTable {...{ changeRequest, isShowOnly }} />
    <FBTasksListTable {...{ changeRequest, isShowOnly, isAdditionalColumnsShown }} />
  </>);
};

export default FBMaterialDisposition;
