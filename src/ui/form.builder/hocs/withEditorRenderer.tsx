import { Box } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import _ from "lodash";
import React from "react";
import FBButton from "../components/inputs/FBButton";
import { FBFieldEditorComponent } from "../defaults/editor";
import editorStore from "../stores/FBEditorStore";
import { formBuilderStore } from "../stores/FBStore";
import { FBEditorFormProps } from "../types/editor";
import { FBTemplateSchema } from "../types/store";

export const withEditorRenderer =
(other: FBEditorFormProps) =>
(props: FormikProps<FBTemplateSchema>) => {

  const { type } = other;
  const InputType = FBFieldEditorComponent[type as string];

  const onClick = () => {
    const schema: FBTemplateSchema = {
      type,
      name: `${formBuilderStore.prefixName}_${type}_field`,
      ...props.values,
    };
    formBuilderStore.schema.push(schema);
    editorStore.open = false;
  };

  return (
    <Form>
      <InputType />
      <Box display="flex" flexDirection="row-reverse" mx={-1}>
        <FBButton label="common.cancel" onClick={editorStore.reset} />
        <FBButton label="form.builder.add.field" onClick={onClick} />
      </Box>
    </Form>
  );
};
