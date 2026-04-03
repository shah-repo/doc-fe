import React from 'react';
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBPartsSelectionProps } from '..';
import { withFBPartsSelection } from './FBPartsSelection.wrap';

const FBPartsSelection: React.FunctionComponent<FBPartsSelectionProps> = ({
  isOutput,
  editorConfig,
  defaultValue,
  filteredOptions,
  isDocumentLHR,
  lhrSelectedPartValue,
  ...props
}) => {
  const optionId = isOutput ? FBAutocompleteAsyncOption.docRevByDoc : FBAutocompleteAsyncOption.availablePartDocuments;
  const urlValues = isOutput ? editorConfig?.id : undefined;

  return (
    <FBAutocompleteAsync
      {...props}
      type="partsselection"
      shouldReloadOnInit={true}
      optionId={optionId}
      filterOptions={isOutput ? filteredOptions : undefined}
      urlValues={urlValues}
      {...{ defaultValue }}
      withState
    />
  );
};

export default withFBPartsSelection(FBPartsSelection);
