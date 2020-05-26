import React, { useState } from "react";
import { withFormik } from "../../../hoc/formik";
import Presenter from "./presenter";
import { TextFieldSelectProps } from "./utils/types";

export const TextFieldSelect: React.FunctionComponent<TextFieldSelectProps> = ({
  label,
  form,
  field,
  disabled,
  ...fieldProps
}) => {
  const [options, filterOptions] = useState(fieldProps.options);
  const [active, setActive] = useState(false);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setActive(true);

    // TODO: remove Autocomplete field, use pure react-select field
    // Creatable https://react-select.com/home#creatable
    const v = event.target.value as string;
    form.setFieldValue(field.name, v);

    filterOptions(
      fieldProps.options &&
      fieldProps.options
        .filter((option) => option.value.toLowerCase().includes(v.toLowerCase())),
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
      disabled={disabled}
    />
  );
};

export default withFormik(TextFieldSelect);
