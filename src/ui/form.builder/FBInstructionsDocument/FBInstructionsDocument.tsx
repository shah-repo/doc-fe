import React from "react";
import { FBAutocompleteAsync, FBInstructionsDocumentProps } from "..";

const FBInstructionsDocument: React.FunctionComponent<FBInstructionsDocumentProps> = ({
  instructionsDocument,
  ...props
}) => (
  <FBAutocompleteAsync
    {...props}
    defaultValue={instructionsDocument}
    disabled={true}
    optionId="1"
  />
);

export default FBInstructionsDocument;
