import { observer } from "mobx-react";
import React from "react";
import FBAddFieldButton0 from "../../components/custom/FBAddFieldButton0";
import FBTransportSchema from "../../components/custom/FBTransportSchema";
import FBForm from "../../components/form/FBForm";
import FBButton from "../../components/inputs/FBButton";
import FBStore from "../../stores/ui/FBStore";
import FBEditorDialog from "../editor/FBEditorDialog";
import FBSortableContainer from "./FBSortableContainer";

const FBWorkspace: React.FunctionComponent<{}> = () => {
  const { schema, mode } = FBStore;
  const isStarter = (mode === "design") && (schema.length === 0);

  const onClick = () => {
    if (FBStore.mode === "form") {
      FBStore.setMode("design");
    } else {
      FBStore.setMode("form");
    }
  };

  return (
    <FBForm initialValues={FBStore.getValues()}>
      {isStarter && <FBAddFieldButton0 />}
      {!isStarter && <FBSortableContainer items={schema} />}
      <FBTransportSchema />
      <FBEditorDialog />
      <FBButton label="View" onClick={onClick} />
      {/* <Box display="flex" flexDirection="row-reverse">
        <FBButton label="Create" onClick={handleSubmit} />
      </Box> */}
    </FBForm>
  );
};

export default observer(FBWorkspace);
