import { Box } from "@material-ui/core";
import { FormikProps } from "formik";
import React from "react";
import FBButton from "../components/inputs/FBButton";
import { FBFieldEditorComponent } from "../defaults/editor";
import editorStore from "../stores/FBEditorStore";
import FBStore from "../stores/FBStore";
import FBValidatorStore from "../stores/ui/FBValidatorStore";
import { FBEditorFormProps } from "../types/editor";
import { FBTemplateSchema } from "../types/store";

export const withEditorRenderer =
(other: FBEditorFormProps) =>
(props: FormikProps<Partial<FBTemplateSchema>>) => {

  const { type, index, mode } = other;
  const { includeNote, includeOther } = props.values;
  const InputType = FBFieldEditorComponent[type as string];

  const onClick = () => {
    const uuidv4 = require("uuid/v4");
    const schema: FBTemplateSchema = {
      type,
      index,
      name: uuidv4(),
      ...props.values as FBTemplateSchema,
      includeNote: includeNote || includeOther,
      rules: FBValidatorStore.getRules(),
    };

    const removeEl = (mode === "create") ? 0 : 1;
    const newSchema = FBStore.schema;
    newSchema.splice(index, removeEl, schema);
    FBStore.setSchema(newSchema);
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
