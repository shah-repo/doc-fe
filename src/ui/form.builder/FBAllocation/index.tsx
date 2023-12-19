import React from 'react';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import FBCheckboxGroup from '../FBCheckboxGroup/FBCheckboxGroup';
import { FB } from '../helpers';
import FBAllocationTreeList from './components/treelist';
import { AllocationCheckBoxOptions, AllocationCheckboxOptions, CHECKBOX_GROUP } from './components/treelist/constants';

const FBAllocation: React.FC = () => {
  const { formState } = FB.useStores();
  const selectedOptions = formState?.getFieldValue(CHECKBOX_GROUP);

  const handleAutoTransactAll = () => {
    // TO DO
  };

  React.useEffect(() => {
    if (selectedOptions?.includes(AllocationCheckBoxOptions.AUTO_TRANSACT)) {
      handleAutoTransactAll();
    }
  }, [selectedOptions]);

  return <>
    <FBCheckboxGroup {...{ options: AllocationCheckboxOptions, name: CHECKBOX_GROUP }} />
    <FBAllocationTreeList documentRevision={{} as DocumentRevision} isDisabled={false}
      isShowOnly={false}
      isUpgradeDisabled={false}
      isExpandAll={selectedOptions?.includes(AllocationCheckBoxOptions.AUTO_ASSIGN)}
    />;
  </>;
};
export default FBAllocation;
