import React from "react";
import FBAddFieldButton0 from "../../components/custom/FBAddFieldButton0";
import FBTransportSchema from "../../components/custom/FBTransportSchema";
import FBForm from "../../components/form/FBForm";
import { withWorkspace } from "../../hocs/withWorkspace";
import { FBWorkspaceProps } from "../../types/workspace";
import FBEditorDialog from "../editor/FBEditorDialog";
import FBSortableContainer from "./FBSortableContainer";
import FBButton from "../../components/inputs/FBButton";
import FBStore from "../../stores/ui/FBStore";

const FBWorkspace: React.FunctionComponent<FBWorkspaceProps> = ({
  includeTransport = true,
  isStarter = true,
  schema = [],
  values = {},
}) => (
  <FBForm initialValues={values}>
    {isStarter && <FBAddFieldButton0 />}
    {!isStarter && <FBSortableContainer items={schema} />}
    {includeTransport && <FBTransportSchema />}
    <FBButton label="View" onClick={() => {
        if (FBStore.mode === "form") {
          FBStore.setMode("design");
        } else {
          FBStore.setMode("form");
        }
      }}
    />
    <FBEditorDialog />
  </FBForm>
);

export default withWorkspace(FBWorkspace);
