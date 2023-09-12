import React from 'react';
import FBBOMTreeList from './components/treelist';
import { FBBOMProps } from './components/treelist/interface';

const FBBOM: React.FunctionComponent<FBBOMProps> = ({ documentRevision, isDisabled, isShowOnly }) => {
  return <FBBOMTreeList documentRevision={documentRevision} isDisabled={isDisabled} isShowOnly={isShowOnly} />;
};

export default FBBOM;
