import { Box } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import React from "react";
import FBButton from "../components/inputs/FBButton";
import { FBFieldEditorComponent } from "../defaults/editor";
import editorStore from "../stores/FBEditorStore";
import FBStore from "../stores/FBStore";
import { FBEditorFormProps } from "../types/editor";
import { FBTemplateSchema } from "../types/store";

export const withEditorRenderer =
(other: FBEditorFormProps) =>
(props: FormikProps<FBTemplateSchema>) => {

  const { type, index, mode } = other;
  const { includeNote, includeOther, fieldName } = props.values;
  const InputType = FBFieldEditorComponent[type as string];

  const onClick = () => {
    const schema: FBTemplateSchema = {
      type,
      index,
      name: fieldName || `${FBStore.prefixName}_field_${type}`,
      ...props.values,
      includeNote: includeNote || includeOther,
    };
    const removeEl = (mode === "create") ? 0 : 1;
    FBStore.schema.splice(index, removeEl, schema);
    editorStore.open = false;
  };

  const buttonLabel = mode === "create"
    ? "form.builder.add.field"
    : "common.save";

  return (
    <Box>
      <InputType />
      <Box display="flex" flexDirection="row-reverse" mx={-1}>
        <FBButton label={buttonLabel} onClick={onClick} />
        <FBButton label="common.cancel" onClick={editorStore.reset} />
      </Box>
    </Box>
  );
};
