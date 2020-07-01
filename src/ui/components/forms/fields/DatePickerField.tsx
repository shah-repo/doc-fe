import DateFnsUtils from "@date-io/date-fns";
import { TextField } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import * as React from "react";
import { TypographyProps } from "../../../../state/ducks/common";
import { Translation } from "../../../translations/types";
import { useFormContext } from "../FormContext";
import Field, { FieldOwnProps } from "./Field";

interface DatePickerOwnProps extends FieldOwnProps {
  label: Translation;
}

type DatePickerPropsWithFormik = DatePickerOwnProps &
FormikFieldProps &
Partial<TypographyProps>;

const DatePicker: React.FunctionComponent<DatePickerPropsWithFormik> = ({
  label,
  ...fieldProps
}) => {
  const { submitForm } = useFormContext();

  const handleDateChange = (date) => {
    const { form } = fieldProps;
    form.setFieldValue(fieldProps.field.name, date);
    submitForm();
  };

  return (
    <Field label={label} {...fieldProps}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          fullWidth={true}
          disableToolbar={true}
          invalidDateMessage=""
          variant="inline"
          inputVariant="outlined"
          format="MM/dd/yyyy"
          autoOk={true}
          label=""
          value={fieldProps.field.value}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          TextFieldComponent={(props) => <TextField {...props} disabled={true} />}
        />
      </MuiPickersUtilsProvider>
    </Field>
  );
};

type DatePickerFieldProps = DatePickerOwnProps &
FieldConfig &
Partial<TypographyProps>;

const DatePickerField: React.FunctionComponent<
DatePickerFieldProps
> = (props) => <FormikField component={DatePicker} {...props} />;

export default DatePickerField;
