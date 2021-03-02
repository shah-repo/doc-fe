import MomentUtils from "@date-io/moment";
import { TextField } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Field as FormikField, FieldConfig, FieldProps as FormikFieldProps } from "formik";
import moment from "moment";
import * as React from "react";
import { useEffect } from "react";
import { TypographyProps } from "../../../../state/ducks/common/types";
import { useFormContext } from "../FormContext";
import Field, { FieldOwnProps } from "./Field";

type DatePickerPropsWithFormik = FieldOwnProps & FormikFieldProps &
Partial<TypographyProps>;

const DatePicker: React.FunctionComponent<DatePickerPropsWithFormik> = ({
  label,
  minDate,
  value,
  ...fieldProps
}) => {
  const { submitForm } = useFormContext();

  useEffect(() => {
    if (value) {
      handleDateChange(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (date) => {
    const { form } = fieldProps;
    form.setFieldValue(fieldProps.field.name, date);
    submitForm();
  };

  return (
    <Field label={label} {...fieldProps}>
      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        <KeyboardDatePicker
          {
            ...{
              minDate,
            }
          }
          defaultValue={value}
          value={fieldProps.field.value}
          fullWidth={true}
          disableToolbar={true}
          invalidDateMessage=""
          variant="inline"
          inputVariant="outlined"
          format="MM/DD/YYYY"
          autoOk={true}
          label=""
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

type DatePickerFieldProps = FieldOwnProps & FieldConfig &
Partial<TypographyProps>;

const DatePickerField: React.FunctionComponent<
  DatePickerFieldProps
> = (props) => <FormikField component={DatePicker} {...props} />;

export default DatePickerField;
