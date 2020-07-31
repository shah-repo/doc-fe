import { Provider } from "mobx-react";
import React from "react";
import { FBButton, FBDialog, FBMapWrapper } from "..";
import { FBDocumentRevisionItem, FBDocumentRevisionProps } from "./FBDocumentRevisions.types";
import { withFBDocumentRevisions } from "./FBDocumentRevisions.wrap";
import FBProposedDocument from "./FBProposedDocument/FBProposedDocument";

const FBDocumentRevisions: React.FunctionComponent<FBDocumentRevisionProps> = ({
  handleAdd,
  dialogState,
  docRevState,
  disabled,
  documentRevisions = [],
}) => (
  <Provider {...{ dialogState, docRevState }}>
    <FBDialog />
    <FBMapWrapper<FBDocumentRevisionItem[]> collection={documentRevisions}>
      {(docRev: FBDocumentRevisionItem, index) => (
        <FBProposedDocument
          key={`fb-document-revision-${docRev.id}-${index}`}
          id={docRev.proposedDocumentRevision?.id}
          justification={docRev.justificationOfChange}
          description={docRev.descriptionOfChange}
          {...{ index, disabled }}
        />
      )}
    </FBMapWrapper>
    <FBButton
      fullWidth={true}
      label="Add a document"
      variant="outlined"
      style={{ margin: "0px 0px 32px 0px" }}
      onClick={handleAdd}
      disabled={disabled}
      dataCy={"fb.add.document"}
    />
  </Provider>
);

export default withFBDocumentRevisions(FBDocumentRevisions);
