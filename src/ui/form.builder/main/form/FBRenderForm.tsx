import { Box } from "@material-ui/core";
import React from "react";
import FBForm from "../../components/form/FBForm";
import FBButton from "../../components/inputs/button/FBButton";
import { flowStore } from "../../stores/flowStore";
import { templateStore, view } from "../../stores/templateStore";
import { FBTemplateSchema } from "../../stores/utils/types";
import { FieldComponent } from "../editor/utils/defaults";

const FBRenderForm: React.FunctionComponent<{}> = ({
}) => {

  const fieldsRenderer = templateStore.schema.map((field, i) => {
    const InputType = FieldComponent[field.type as string];
    return <InputType key={`${name}_${i}`} {...field} />;
  });

  const handleSubmit = (values: FBTemplateSchema) => {
    if (flowStore.mode === "view") {
      console.log("Save templateStore to local storage");
    } else {
      console.log("Save values to localStorage");
    }
  };

  return (
    <FBForm onSubmit={handleSubmit}>
      {fieldsRenderer}
      <Box display="flex" flexDirection="row-reverse">
        {templateStore.schema.length > 0 && <FBButton type="submit" label="Create" />}
      </Box>
    </FBForm>
  );
};

export default view(FBRenderForm);
