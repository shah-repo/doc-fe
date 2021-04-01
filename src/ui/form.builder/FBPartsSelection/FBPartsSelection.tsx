import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBPartsSelectionProps } from "..";
import { withFBPartsSelection } from "./FBPartsSelection.wrap";

const FBPartsSelection: React.FunctionComponent<FBPartsSelectionProps> = ({
  isOutput,
  editorConfig,
  defaultValue,
  ...props
}) => (
  <FBAutocompleteAsync
    {...props}
    type="partsselection"
    shouldReloadOnInit={true}
    optionId={isOutput ? FBAutocompleteAsyncOption.docRevByDoc : FBAutocompleteAsyncOption.availablePartDocuments}
    urlValues={{ documentId: editorConfig?.id }}
    {...{ defaultValue }}
    withState
  />
);

export default withFBPartsSelection(FBPartsSelection);
