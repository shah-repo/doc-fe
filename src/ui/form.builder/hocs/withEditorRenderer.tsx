import { Form, FormikProps } from "formik";
import _ from "lodash";
import React from "react";
import FBButton from "../components/inputs/FBButton";
import { formBuilderStore } from "../stores/FBStore";
import { FBEditorFormProps } from "../types/editor";
import { FBTemplateSchema } from "../types/store";
import { FBFieldEditorComponent } from "../defaults/editor";

export const withEditorRenderer =
(other: FBEditorFormProps) =>
(props: FormikProps<FBTemplateSchema>) => {

  const { type, setDialogClose } = other;
  const InputType = FBFieldEditorComponent[type as string];

  const onClick = () => {
    const schema: FBTemplateSchema = {
      type,
      name: `${formBuilderStore.prefixName}_${type}_field`,
      ...props.values,
    };
    formBuilderStore.schema.push(schema);
    if (setDialogClose) {
      setDialogClose();
    }
  };

  return (
    <Form>
      <InputType />
      <FBButton label="Add Field" onClick={onClick} />
    </Form>
  );
};
