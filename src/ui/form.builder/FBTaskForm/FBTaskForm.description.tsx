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
      optionId={FBAutocompleteAsyncOption.approver}
      optionValueType="id"
      label="Assigned to"
      name="assigned"
      rules="required"
    />
    <FBDatePicker label="Due Date" name="dueDate" rules="required" />
    {children}
  </FBForm>
);

export default withFBTaskForm(FBTaskFormDescription);
