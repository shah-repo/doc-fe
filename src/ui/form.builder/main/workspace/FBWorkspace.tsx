import { observer } from "mobx-react";
import React from "react";
import FBAddFieldButton0 from "../../components/custom/FBAddFieldButton0";
import FBEditorWrapper from "../../components/custom/FBEditorWrapper";
import FBForm from "../../components/form/FBForm";
import { FBFieldComponent } from "../../defaults/editor";
import { withFBStore } from "../../hocs/withFBStore";
import formBuilderStore from "../../stores/FBStore";
import { FBStoreProps } from "../../types/store";
import FBEditorDialog from "../editor/FBEditorDialog";
import FBSortableContainer from "./FBSortableContainer";
import FBImportExport from "../../components/custom/FBImportExport";

const FBWorkspace: React.FunctionComponent<FBStoreProps> = ({
  formBuilderStore: { schema, mode },
}) => {
  const isStarter = mode === "design" && schema.length === 0;

  const fieldsRenderer = schema.map((field, i) => {
    const { type, name } = field;
    const InputType = FBFieldComponent[type as string];

    return (
      <FBEditorWrapper key={`${name}_${i}`} index={i} {...field}>
        <InputType {...field} {...formBuilderStore.fieldMode} />
      </FBEditorWrapper>
    );
  });

  return (
    <FBForm initialValues={formBuilderStore.values}>
      {isStarter && <FBAddFieldButton0 />}
      {!isStarter && <FBSortableContainer items={schema} />}
      <FBImportExport />
      <FBEditorDialog />
      {/* <Box display="flex" flexDirection="row-reverse">
        <FBButton label="Create" onClick={handleSubmit} />
      </Box> */}
    </FBForm>
  );
};

export default withFBStore(observer(FBWorkspace));
