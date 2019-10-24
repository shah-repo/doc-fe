import { observer } from "mobx-react";
import React from "react";
import FBAddFieldButton0 from "../../components/custom/FBAddFieldButton0";
import FBForm from "../../components/form/FBForm";
import { withFBStore } from "../../hocs/withFBStore";
import formBuilderStore from "../../stores/FBStore";
import { FBStoreProps } from "../../types/store";
import FBEditorDialog from "../editor/FBEditorDialog";
import FBSortableContainer from "./FBSortableContainer";

const FBWorkspace: React.FunctionComponent<FBStoreProps> = ({
  formBuilderStore : { schema, mode },
}) => {
  const isStarter = (mode === "design") && (schema.length === 0);

  return (
    <FBForm initialValues={formBuilderStore.values}>
      {isStarter && <FBAddFieldButton0 />}
      {!isStarter && <FBSortableContainer items={schema} />}
      <FBEditorDialog />
      {/* <Box display="flex" flexDirection="row-reverse">
        <FBButton label="Create" onClick={handleSubmit} />
      </Box> */}
    </FBForm>
  );
};

export default withFBStore(observer(FBWorkspace));
