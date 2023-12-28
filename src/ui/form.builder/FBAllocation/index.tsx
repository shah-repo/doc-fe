import React from 'react';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import FBCheckboxGroup from '../FBCheckboxGroup/FBCheckboxGroup';
import { FB } from '../helpers';
import FBAllocationTreeList from './components/treelist';
import { AllocationCheckBoxOptions, AllocationCheckboxOptions, CHECKBOX_GROUP } from './components/treelist/constants';
interface Props{
  documentRevision: DocumentRevision
}

const FBAllocation: React.FC<Props> = ({ documentRevision }) => {
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
    <FBAllocationTreeList
      documentRevision={documentRevision}
      isDisabled={false}
      isShowOnly={false}
      isExpandAll={selectedOptions?.includes(AllocationCheckBoxOptions.AUTO_ASSIGN)}
    />;
  </>;
};
export default FBAllocation;
