import React from "react";
import { withFormik } from "../../../hoc/formik";
import Presenter from "./presenter";
import { EditableSelectContainerProps } from "./utils/types";

const EditableSelectContainer: React.FunctionComponent<EditableSelectContainerProps> = ({
  name = "",
  form,
  field,
  ...other
}) => {

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const v = event.target.value as string;
    form.setFieldValue(name, v);
  };

  return (
    <Presenter
      {...other}
      name={name}
      value={field && field.value}
      handleChange={handleChange}
      form={form}
      field={field}
    />
  );
};

export default withFormik(EditableSelectContainer);
