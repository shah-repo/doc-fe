import React from "react";
import { FBInstructionsDocumentProps } from ".";
import FBAutocompleteAsync from "../FBAutocompleteAsync";

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
