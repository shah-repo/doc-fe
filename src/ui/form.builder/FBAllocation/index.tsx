import React from 'react';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import FBBOMTreeList from './components/treelist';

const FBAllocation: React.FC = () => {
  return <FBBOMTreeList documentRevision={{} as DocumentRevision} isDisabled={false}
    isShowOnly={false}
    isUpgradeDisabled={false}
    isSliderView={false}
  />;
};
export default FBAllocation;
