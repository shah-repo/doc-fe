import React from "react";
import { FBButton } from "..";
import { FBDocumentRevisionProps } from "./FBDocumentRevisions.types";
import ProposedDocument from "./ProposedDocument";


const FBDocumentRevisionsField: React.FunctionComponent<FBDocumentRevisionProps> = ({
  name,
  disabled,
  dialogState,
  docRevState,
  onClick,
  removeDocument,
  ...props
}) => (
  <React.Fragment>
    {docRevState?.documentRevisions?.map((e, index) =>
      <ProposedDocument
        id={e.documentRevision.id}
        justification={e.justificationOfChange}
        description={e.descriptionOfChange}
        index={index + 1}
        removeDocument={removeDocument}
      />
          )}
    <FBButton
      fullWidth={true}
      label="Add a document"
      variant="outlined"
      style={{ margin: "0px 0px 32px 0px" }}
      {...{ onClick }}
      disabled={disabled}
    />
  </React.Fragment>
);

export default FBDocumentRevisionsField;
