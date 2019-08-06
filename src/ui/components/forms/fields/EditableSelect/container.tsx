import React from "react";
import Presenter from "./presenter";
import { EditableSelectContainerProps } from "./utils/types";

export const EditableSelectContainer: React.FunctionComponent<EditableSelectContainerProps> = ({
  name,
  form,
  field: { value },
  ...other
}) => {

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const v = event.target.value as string;
    form.setFieldValue(name, v);
  };

  return (
    <Presenter {...other} name={name} value={value} handleChange={handleChange} />
  );
};

export default EditableSelectContainer;
