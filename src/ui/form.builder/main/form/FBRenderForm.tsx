import { Box } from "@material-ui/core";
import React from "react";
import FBForm from "../../components/form/FBForm";
import FBButton from "../../components/inputs/button/FBButton";
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
    // tslint:disable-next-line: no-console
    console.log(values);
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
