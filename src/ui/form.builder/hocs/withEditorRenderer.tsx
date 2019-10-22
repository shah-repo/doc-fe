import { Box } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import _ from "lodash";
import React from "react";
import FBButton from "../components/inputs/FBButton";
import { FBFieldEditorComponent } from "../defaults/editor";
import editorStore from "../stores/FBEditorStore";
import formBuilderStore from "../stores/FBStore";
import { FBEditorFormProps } from "../types/editor";
import { FBTemplateSchema } from "../types/store";

export const withEditorRenderer =
(other: FBEditorFormProps) =>
(props: FormikProps<FBTemplateSchema>) => {

  const { type, index } = other;
  const { includeNote, includeOther, fieldName } = props.values;
  const InputType = FBFieldEditorComponent[type as string];

  const onClick = () => {
    const schema: FBTemplateSchema = {
      type,
      index,
      name: fieldName || `${formBuilderStore.prefixName}_field_${type}`,
      ...props.values,
      includeNote: includeNote || includeOther,
    };
    formBuilderStore.schema[index] = schema;
    editorStore.open = false;
  };

  const buttonLabel = (formBuilderStore.schema[index] === undefined)
    ? "form.builder.add.field"
    : "common.save";

  return (
    <Form>
      <InputType />
      <Box display="flex" flexDirection="row-reverse" mx={-1}>
        <FBButton label={buttonLabel} onClick={onClick} />
        <FBButton label="common.cancel" onClick={editorStore.reset} />
      </Box>
    </Form>
  );
};
