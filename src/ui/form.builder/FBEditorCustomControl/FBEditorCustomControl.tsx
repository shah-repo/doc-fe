import { CircularProgress } from "@material-ui/core";
import React from "react";
import { FBButton, FBEditorCustomControlProps, FBMapWrapper } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { withFBEditorCustomControl } from "./FBEditorCustomControl.wrap";

const FBEditorCustomControl: React.FunctionComponent<FBEditorCustomControlProps> = ({
  controls = [],
  loading,
  handleSelect,
  ...props
}) => (
  <>
    {loading && <CircularProgress size={20} />}
    {!loading && (
      <FBMapWrapper<DocumentRevision> collection={controls}>
        {(control: DocumentRevision, i) => (
          <FBButton
            key={`form.builder.${control.id}-${i}`}
            label={control.name}
            onClick={() => handleSelect && handleSelect(control)}
          />
        )}
      </FBMapWrapper>
    )}
  </>
);

export default withFBEditorCustomControl(FBEditorCustomControl);
