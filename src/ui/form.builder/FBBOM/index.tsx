import React from 'react';
import FBBOMTreeList from './components/treelist';
import { FBBOMProps } from './components/treelist/interface';

const FBBOM: React.FunctionComponent<FBBOMProps> = ({ documentRevision, isDisabled, isShowOnly, isUpgradeDisabled, isMaxDialogOpen, isSliderView }) => {
  return <FBBOMTreeList documentRevision={documentRevision} isDisabled={isDisabled}
    isShowOnly={isShowOnly}
    isUpgradeDisabled={isUpgradeDisabled}
    isMaxDialogOpen = {isMaxDialogOpen}
    isSliderView={isSliderView}
  />;
};

export default React.memo(FBBOM);
