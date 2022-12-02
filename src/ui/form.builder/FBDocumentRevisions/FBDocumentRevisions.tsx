import React from "react";
import { FBButton, FBDialog, FBDocumentRevisionsItem, FBDocumentRevisionsProps, FBDocumentRevisionsValue, FBInput, FBMapWrapper, FBProvider } from "..";
import { withFBDocumentRevisions } from "./FBDocumentRevisions.wrap";

const FBDocumentRevisions: React.FunctionComponent<FBDocumentRevisionsProps> = ({
  handleForm,
  handleOpen,
  remove,
  dialogState,
  collection = [],
  name,
  gutter,
  disabled,
  index,
}) => (
  <FBProvider {...{ dialogState }}>
    <FBDialog />
    <FBInput {...{ name, gutter, index }} type="documentRevisions">
      <FBMapWrapper<FBDocumentRevisionsValue[]> {...{ collection }}>
        {(value: FBDocumentRevisionsValue, index) => (
          <FBDocumentRevisionsItem
            key={`fb-document-revision-${value.id}-${index}`}
            {...{ name, disabled, index, handleOpen, remove }}
            id={value.proposedDocumentRevision.id}
          />
        )}
      </FBMapWrapper>
      <FBButton
        {...{ disabled }}
        fullWidth={true}
        label="form.builder.add.document"
        variant="outlined"
        style={{ margin: 0 }}
        onClick={handleForm}
        dataCy={"fb.add.document"}
      />
    </FBInput>
  </ FBProvider>
);

export default withFBDocumentRevisions(FBDocumentRevisions);
