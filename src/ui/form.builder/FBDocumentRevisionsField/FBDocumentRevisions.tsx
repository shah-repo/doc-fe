import { Provider } from "mobx-react";
import React from "react";
import { FBButton, FBDialog, FBMapWrapper, FBSection } from "..";
import { FBDocumentRevisionItem, FBDocumentRevisionProps } from "./FBDocumentRevisions.types";
import { withFBDocumentRevisions } from "./FBDocumentRevisions.wrap";
import FBProposedDocument from "./FBProposedDocument/FBProposedDocument";

const FBDocumentRevisions: React.FunctionComponent<FBDocumentRevisionProps> = ({
  dialogState,
  name,
  docRevState,
  disabled,
  onClick,
  removeDocument,
  isMouseInside,
  setMouseInside,
  proposedDocumentRevision,
}) =>   (
  <Provider {...{ dialogState, docRevState }}>
    <FBSection label="form.builder.change.request.details" />
    <FBDialog />
    <React.Fragment>
      <FBMapWrapper<FBDocumentRevisionItem[] | undefined>
        collection={docRevState?.documentRevisions}>
        {(e, index) =>
          <FBProposedDocument
            id={e.id}
            justification={e.justificationOfChange}
            description={e.descriptionOfChange}
            index={index + 1}
            {...{ removeDocument, isMouseInside, setMouseInside, proposedDocumentRevision }}
          />
        }
      </FBMapWrapper>
      <FBButton
        fullWidth={true}
        label="Add a document"
        variant="outlined"
        style={{ margin: "0px 0px 32px 0px" }}
        {...{ onClick }}
        disabled={disabled}
      />
    </React.Fragment>
  </Provider>
);

export default withFBDocumentRevisions(FBDocumentRevisions);
