import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBData, FBDatePicker, FBForm, FBSchema, FBTaskFormProps } from "..";
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
      label="common.assigned.to"
      name="assigned"
      rules="required"
    />
    <FBDatePicker label="common.due.by" name="dueDate" rules="required" />
    {children}
  </FBForm>
);

export default withFBTaskForm(FBTaskFormDescription);
