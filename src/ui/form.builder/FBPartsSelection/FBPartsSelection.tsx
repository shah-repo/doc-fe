import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBPartsSelectionProps } from "..";
import { withFBPartsSelection } from "./FBPartsSelection.wrap";

const FBPartsSelection: React.FunctionComponent<FBPartsSelectionProps> = ({
  isOutput,
  editorConfig,
  defaultValue,
  filteredOptions,
  isDocumentLHR,
  ...props
}) => (
  <FBAutocompleteAsync
    {...props}
    type="partsselection"
    shouldReloadOnInit={true}
    optionId={isOutput ? FBAutocompleteAsyncOption.docRevByDoc : FBAutocompleteAsyncOption.availablePartDocuments}
    filterOptions={isOutput ? filteredOptions : undefined}
    urlValues={{ documentId: editorConfig?.id }}
    withoutLabelKey={isDocumentLHR}
    {...{ defaultValue }}
    withState
  />
);

export default withFBPartsSelection(FBPartsSelection);
