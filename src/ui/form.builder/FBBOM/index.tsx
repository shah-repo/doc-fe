import React from 'react';
import FBBOMTreeList from './components/treelist';
import { FBBOMProps } from './components/treelist/interface';

const FBBOM: React.FunctionComponent<FBBOMProps> = ({ documentRevision, isDisabled, showOnly }) => {
  return <FBBOMTreeList documentRevision={documentRevision} isDisabled={isDisabled} showOnly={showOnly} />;
};

export default FBBOM;
