import { CircularProgress } from "@material-ui/core";
import React from "react";
import { FBButton, FBDynamicControlProps, FBMapWrapper } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { withFBDynamicControl } from "./FBDynamicControl.wrap";

const FBDynamicControl: React.FunctionComponent<FBDynamicControlProps> = ({
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

export default withFBDynamicControl(FBDynamicControl);
