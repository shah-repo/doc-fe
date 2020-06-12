import React from "react";
import { FBProvider, FBSection } from "..";
import { FBDocumentRevisionProps } from "./FBDocumentRevisions.types";
import { withFBDocumentRevisions } from "./FBDocumentRevisions.wrap";
import FBDocumentRevisionsField from "./FBDocumentRevisionsField";

const FBDocumentRevisions: React.FunctionComponent<FBDocumentRevisionProps> = ({
  dialogState,
  name,
  docRevState,
  disabled,
}) =>   (
  <FBProvider {...{ dialogState, docRevState }}>
    <FBSection label="Change Request Details" key="ddd" />
    <FBDocumentRevisionsField name={name} disabled={disabled} {...{ dialogState, docRevState }} />
  </FBProvider>
);

export default withFBDocumentRevisions(FBDocumentRevisions);
