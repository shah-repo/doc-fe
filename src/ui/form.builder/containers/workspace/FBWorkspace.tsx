import Box from "@material-ui/core/Box/Box";
import React from "react";
import FBAddFieldButton0 from "../../components/custom/FBAddFieldButton0";
import FBTransportSchema from "../../components/custom/FBTransportSchema";
import FBButton from "../../components/inputs/FBButton";
import { withWorkspace } from "../../hocs/withWorkspace";
import FBStore from "../../stores/ui/FBStore";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBWorkspaceProps } from "../../types/workspace";
import FBEditorDialog from "../editor/FBEditorDialog";
import FBSortableContainer from "./FBSortableContainer";

const FBWorkspace: React.FunctionComponent<FBWorkspaceProps> = ({
  includeTransport = true,
  isStarter = true,
  schema = [],
}) => (
  <Box>
    {isStarter && <FBAddFieldButton0 />}
    {!isStarter && <FBSortableContainer items={schema} />}
    {includeTransport && <FBTransportSchema />}
    <FBEditorDialog />
    <FBButton
      label="View"
      onClick={() => {
        if (FBStore.mode === "design") {
          FBStore.setMode("form");
          FBValidatorStore.customValidate();
        } else {
          FBStore.setMode("design");
        }
      }}
    />
  </Box>
);

export default withWorkspace(FBWorkspace);
