import { Provider } from "mobx-react";
import React from "react";
import { FBDialog, FBSection } from "..";
import { FBDocumentRevisionProps } from "./FBDocumentRevisions.types";
import { withFBDocumentRevisions } from "./FBDocumentRevisions.wrap";
import FBDocumentRevisionsField from "./FBDocumentRevisionsField";

const FBDocumentRevisions: React.FunctionComponent<FBDocumentRevisionProps> = ({
  dialogState,
  name,
  docRevState,
  disabled,
  onClick,
  removeDocument,
}) =>   (
  <Provider {...{ dialogState, docRevState }}>
    <FBSection label="form.builder.change.request.details" key="changeRequestDetails" />
    <FBDialog />
    <FBDocumentRevisionsField
      name={name}
      disabled={disabled}
      {...{ dialogState, docRevState }}
      onClick={onClick}
      removeDocument={removeDocument}
    />
  </Provider>
);

export default withFBDocumentRevisions(FBDocumentRevisions);
