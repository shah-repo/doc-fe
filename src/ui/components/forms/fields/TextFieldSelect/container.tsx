import React, { useState } from "react";
import { withFormik } from "../../../hoc/formik";
import Presenter from "./presenter";
import { TextFieldSelectProps } from "./utils/types";

export const TextFieldSelect: React.FunctionComponent<TextFieldSelectProps> = ({
  label,
  form,
  field,
  ...fieldProps
}) => {
  const [options, filterOptions] = useState(fieldProps.options);
  const [active, setActive] = useState(true);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setActive(true);

    const v = event.target.value as string;
    form!.setFieldValue(field.name!, v);

    filterOptions(
      fieldProps.options!.filter((option) => option.value.includes(v)),
    );

    if (!form.touched[field.name]) {
      form.setFieldTouched(field.name, true);
    }
  };

  const handleBlur = (event: React.FocusEvent) => {
    setActive(false);
  };

  return (
    <Presenter
      {...fieldProps}
      handleBlur={handleBlur}
      isActive={active}
      name={field.name}
      label={label}
      value={field && field.value}
      handleChange={handleChange}
      form={form}
      field={field}
      options={options}
    />
  );
};

export default withFormik(TextFieldSelect);
