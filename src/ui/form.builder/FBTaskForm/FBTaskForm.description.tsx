import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBData, FBDatePicker, FBForm, FBTaskFormProps } from "..";
import { FBSchema } from "../FBSchema";
import { withFBTaskForm } from "./FBTaskForm.wrap";

const FBTaskFormDescription: React.FunctionComponent<FBTaskFormProps> = ({
  formState,
  children,
}) => (
  <FBForm {...{ formState }} >
    <FBSchema schema={FBData.taskSchema} />
    <FBAutocompleteAsync
      optionId={FBAutocompleteAsyncOption.availableApprovers}
      optionValueType="id"
      label="form.builder.assigned.to"
      name="assigned"
      rules="required"
    />
    <FBDatePicker label="form.builder.due.by" name="dueDate" rules="required" />
    {children}
  </FBForm>
);

export default withFBTaskForm(FBTaskFormDescription);
