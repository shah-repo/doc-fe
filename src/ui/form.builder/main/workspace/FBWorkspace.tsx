import { observer } from "mobx-react";
import React from "react";
import FBAddFieldButton0 from "../../components/custom/FBAddFieldButton0";
import FBEditorWrapper from "../../components/custom/FBEditorWrapper";
import FBForm from "../../components/form/FBForm";
import { FBFieldComponent } from "../../defaults/editor";
import { withFBStore } from "../../hocs/withFBStore";
import { FBStoreProps } from "../../types/store";
import FBEditorDialog from "../editor/FBEditorDialog";

const FBWorkspace: React.FunctionComponent<FBStoreProps> = ({
  formBuilderStore : { schema, mode },
}) => {
  const isStarter = (mode === "design") && (schema.length === 0);

  const fieldsRenderer = schema.map((field, i) => {
    const InputType = FBFieldComponent[field.type as string];
    return (
      <FBEditorWrapper key={`${name}_${i}`} index={i}>
        <InputType {...field} />
      </FBEditorWrapper>
    );
  });

  return (
    <FBForm>
      {isStarter && <FBAddFieldButton0 />}
      {!isStarter && fieldsRenderer}
      <FBEditorDialog />
      {/* <Box display="flex" flexDirection="row-reverse">
        <FBButton label="Create" onClick={handleSubmit} />
      </Box> */}
    </FBForm>
  );
};

export default withFBStore(observer(FBWorkspace));
