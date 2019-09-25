import React from "react";
import FBForm from "../../components/form/FBForm";
import FBTextField from "../../components/inputs/textfield/FBTextField";
import { templateStore, view } from "../../stores/templateStore";
import { FBBasicFieldEditorComponent } from "../editor/utils/defaults";

const FBRenderForm: React.FunctionComponent<{}> = ({
}) => {

  const fieldsRenderer = templateStore.schema.map((field, i) => {
    const InputType = FBBasicFieldEditorComponent[field.type as string];
    return <FBTextField key={`${name}_${i}`} {...field} />;
  });

  return (
    <FBForm>
      {fieldsRenderer}
    </FBForm>
  );
};

export default view(FBRenderForm);
