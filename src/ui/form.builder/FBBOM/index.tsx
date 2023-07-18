import React from 'react';
import FBBOMTreeList from './components/treelist';
import { FBBOMProps } from './components/treelist/interface';

const FBBOM: React.FunctionComponent<FBBOMProps> = ({ documentRevision }) => {
  return <FBBOMTreeList documentRevision={documentRevision} />;
};

export default FBBOM;
