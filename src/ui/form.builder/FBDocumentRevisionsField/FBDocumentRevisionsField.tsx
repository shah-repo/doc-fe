import React from "react";
import { FBButton, FBData, FBDialog, FBForm } from "..";
import FBDocumentRevisionActions from "./FBDocumentRevisionActions/FBDocumentRevisionActions";
import { FBDocumentRevisionProps } from "./FBDocumentRevisions.types";
import ProposedDocument from "./ProposedDocument";


const FBDocumentRevisionsField: React.FunctionComponent<FBDocumentRevisionProps> = ({
  name,
  disabled,
  dialogState,
  docRevState,
  ...props
}) => {
  const onClick = () => {
    dialogState?.config({
      open: true,
      title: "Add Document Revision",
      content: <FBForm schema={FBData.documentRevisionSchema} />,
      actions: <FBDocumentRevisionActions />,
    });
  };

  const removeDocument = (index: number) => {
    docRevState?.removeDocRevItem(index);
  };

  return (
    <div>
      <React.Fragment>
        <FBDialog />
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
    </div>
  );
};

export default FBDocumentRevisionsField;
