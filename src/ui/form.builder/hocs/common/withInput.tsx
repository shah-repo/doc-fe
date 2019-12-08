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

  const Comp = ({
    form,
    name = "",
    type = "",
    children,
    value,
    defaultValue,
    ...props
  }: T) => {

    const elements = React.Children.toArray(children);
    value = _.get(form, `values.${name}`);
    value === undefined && (value = defaultValue || _.get(FBFormValues, type));

    if (elements.length === 1) {
      _.first(elements) && (
        children = React.cloneElement(_.first(elements) as React.ReactElement, {
          name,
          value,
          type,
          ..._.pick(props, ["disabled", "onChange"]),
        })
      );
    }

    return Component({
      ...(props as T),
      value,
      form,
      name,
      type,
      children,
    });
  };

  return (
    withFormik<any, FBTemplateSchema | Dictionary<any>>(
    withOnChange(
      (props: T) => Comp(props)),
  ));
};
