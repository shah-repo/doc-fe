import React from 'react';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import FBMaterialDispositionTable from './components/FBMaterialDispositionTable';
import FBTasksListTable from './components/FBTasksListTable';

interface props {
  changeRequest?: ChangeRequest
}

const FBMaterialDisposition: React.FunctionComponent<props> = ({ changeRequest }) => {
  return (<>
    <FBMaterialDispositionTable {...{ changeRequest }} />
    <FBTasksListTable />
  </>);
};

export default FBMaterialDisposition;
