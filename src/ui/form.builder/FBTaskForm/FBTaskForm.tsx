import React from "react";
import { FB, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBData, FBDatePicker, FBForm, FBTaskFormProps, FBTextField } from "..";
import { FBSchema } from "../FBSchema";
import { withFBTaskForm } from "./FBTaskForm.wrap";

const FBTaskForm: React.FunctionComponent<FBTaskFormProps> = ({
  formState,
  children,
  initialValues,
  index,
}) => (
  <FBForm {...{ formState }} >
    <FBTextField name="id" hidden={true} defaultValue={FB.uniqid} />
    <FBTextField name="index" type="number" hidden={true} defaultValue={index} />
    <FBSchema schema={FBData.taskSchema} />
    <FBAutocompleteAsync optionId={FBAutocompleteAsyncOption.approver} label="Assigned to" name="assignedTo" />
    <FBDatePicker label="Due Date" name="dueDate" rules="required" />
    {children}
  </FBForm>
);

export default withFBTaskForm(FBTaskForm);
