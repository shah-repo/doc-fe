import React from 'react';
import { DocRevOption, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBPartsSelectionProps } from '..';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';
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
  if (urlValues) {
    const hasDataForOptionId = Boolean(FBAutocompleteAsyncStore.data.get(optionId));
    if (hasDataForOptionId) {
      const existingOptions: DocRevOption[] = Array.from(FBAutocompleteAsyncStore.data.get(optionId).values());
      const hasDataForUrlValue = existingOptions.filter((option: DocRevOption) => option.id === lhrSelectedPartValue);
      // length 0 implies that data exists but is stale, hence reset
      if (hasDataForUrlValue.length === 0) {
        FBAutocompleteAsyncStore.reset(optionId);
      }
    }
  }
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
  ); };

export default withFBPartsSelection(FBPartsSelection);
