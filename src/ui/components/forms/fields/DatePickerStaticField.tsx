import MomentUtils from "@date-io/moment";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
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
  const muiTheme = createMuiTheme({
    overrides: {},
  });

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
        <ThemeProvider theme={muiTheme}>
          <KeyboardDatePicker
            {
              ...{
                minDate,
              }
            }
            size="small"
            defaultValue={value}
            value={fieldProps.field.value}
            fullWidth={true}
            disableToolbar={true}
            invalidDateMessage=""
            variant="static"
            autoOk={true}
            label=""
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </Field>
  );
};

type DatePickerStaticFieldProps = FieldOwnProps & FieldConfig &
Partial<TypographyProps>;

const DatePickerStaticField: React.FunctionComponent<
  DatePickerStaticFieldProps
> = (props) => <FormikField component={DatePicker} {...props} />;

export default DatePickerStaticField;
