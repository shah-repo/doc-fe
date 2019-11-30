import React from "react";
import { FBFormikFieldProps } from "../../types/formik";
import _ from "lodash";

export const withOnChange = <T extends FBFormikFieldProps>(
  Component: React.FunctionComponent<T>,
) => {
  return ({
    onChange,
    ...props
  }: T) => {
    const { field, form, name = "" } = props;

    function checkOptions(value: any): any {
      if (_.has(value, "props")) {
        return value.props.value;
      }
      return value;
    }

    const handleChange = (event: React.ChangeEvent<{}>, value: any = undefined) => {
      if (!form && !field) {
        return;
      }
      if (!_.isUndefined(value)) {
        value =  checkOptions(value);
      }
      form!.setFieldValue(name, value);
    };

    return Component({
        ...(props as T),
        onChange: onChange || (handleChange),
      });
    };
};
