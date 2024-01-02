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

  // React.useEffect(() => {
  //   // TODO update auto save options
  //   if (!selectedOptions?.includes(AllocationCheckBoxOptions.AUTO_ASSIGN)) {
  //     // console.log(formState?.getValues());
  //   // workspaceState?.saveDocRev({ autoAssign: true, autoTransact: true });
  //   }
  // }, [selectedOptions]);

  return <>
    <FBCheckboxGroup
      {...{ options: AllocationCheckboxOptions, name: CHECKBOX_GROUP }}
      defaultValue={[AllocationCheckBoxOptions.AUTO_ASSIGN]}
    />
    <FBAllocationTreeList
      documentRevision={documentRevision}
      isDisabled={false}
      isShowOnly={false}
      isExpandAll={selectedOptions?.includes(AllocationCheckBoxOptions.AUTO_ASSIGN)}
    />;
  </>;
};
export default FBAllocation;
