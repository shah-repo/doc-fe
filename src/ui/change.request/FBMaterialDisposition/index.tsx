import React from 'react';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import FBMaterialDispositionTable from './components/FBMaterialDispositionTable';
import FBTasksListTable from './components/FBTasksListTable';

interface props {
  changeRequest?: ChangeRequest
  isShowOnly?: boolean
}

const FBMaterialDisposition: React.FunctionComponent<props> = ({ changeRequest, isShowOnly }) => {
  return (<>
    <FBMaterialDispositionTable {...{ changeRequest }} isShowOnly={isShowOnly} />
    <FBTasksListTable {...{ changeRequest }} isShowOnly={isShowOnly} />
  </>);
};

export default FBMaterialDisposition;
