import { Box } from "@material-ui/core";
import { FormikProps } from "formik";
import React from "react";
import FBButton from "../components/inputs/FBButton";
import { FBFieldEditorComponent } from "../defaults/editor";
import editorStore from "../stores/ui/FBEditorStore";
import FBStore from "../stores/ui/FBStore";
import FBValidatorStore from "../stores/ui/FBValidatorStore";
import { FBEditorFormProps } from "../types/editor";
import { FBTemplateSchema } from "../types/store";

export const withEditorRenderer =
(other: FBEditorFormProps) =>
(props: FormikProps<Partial<FBTemplateSchema>>) => {

  const { type, index, mode } = other;
  const InputType = FBFieldEditorComponent[type as string];
  const uuidv4 = require("uuid/v4");

  const schemaItem = (): FBTemplateSchema => ({
    type,
    index,
    name: uuidv4(),
    // rules: FBValidatorStore.getRules(),
    ...props.values,
  });

  const onClick = () => {

    const item = schemaItem();
    console.log(item);

    const schema: FBTemplateSchema = {
      type,
      index,
      name: uuidv4(),
      ...props.values as FBTemplateSchema,
      // rules: FBValidatorStore.getRules(),
      // applicableOn: FBValidatorStore.applicableOn ? [FBValidatorTrigger.ON_STATE_TO_IN_REVIEW] : [],
    };
    FBValidatorStore.applicableOn = false;
    FBValidatorStore.resetIndicatorValues();

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
