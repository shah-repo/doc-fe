import React from "react";
import { FB, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBDatePicker, FBForm, FBTaskFormProps, FBTextEditor, FBTextField } from "..";
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
    <FBTextField label="Title" name="title" rules="required" />
    <FBTextEditor label="Description" name="description" rules="required" />
    <FBAutocompleteAsync optionId={FBAutocompleteAsyncOption.approver} label="Assigned to" name="assignedTo" />
    <FBDatePicker label="Due Date" name="dueDate" rules="required" />
    {children}
  </FBForm>
);

export default withFBTaskForm(FBTaskForm);
