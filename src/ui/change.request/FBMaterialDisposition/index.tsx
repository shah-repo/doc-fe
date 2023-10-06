import React from 'react';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import FBMaterialDispositionTable from './components/FBMaterialDispositionTable';

interface props {
  changeRequest?: ChangeRequest
}

const FBMaterialDisposition: React.FunctionComponent<props> = ({ changeRequest }) => {
  return <FBMaterialDispositionTable {...{ changeRequest }} />;
};

export default FBMaterialDisposition;
