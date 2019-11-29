import { Dictionary } from "lodash";
import _ from "lodash";
import React from "react";
import { FBFormValues } from "../../defaults/formik";
import { FBInputProps } from "../../types/common";
import { FBTemplateSchema } from "../../types/store";
import { withFormik } from "./withFormik";
import { withOnChange } from "./withOnChange";

export const withInput = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>,
) => {
  return withFormik<any, FBTemplateSchema | Dictionary<any>>(withOnChange((props: T) => {
      const { form, name = "", type = "" } = props;

      const value = (): any => {
        if (form && !_.isEmpty(form.values[name])) {
          return form.values[name];
        }
        return FBFormValues[type];
      };

      return Component({
        ...(props as T),
        value: value(),
      });
    },
  ));
};
