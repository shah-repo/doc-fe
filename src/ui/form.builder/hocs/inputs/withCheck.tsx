import _ from "lodash";
import React from "react";
import Text from "../../../components/Text";
import { FBCheckControl } from "../../defaults/check";
import { FBCheckProps, FBCheckType } from "../../types/inputs/check";

export const withCheck = <T extends FBCheckProps>(
  Component: React.FunctionComponent<T>,
  type: FBCheckType = "checkbox",
) => {
  return ({
    label,
    labelValues,
    onChange,
    name,
    ...props
  }: T) => {

    const InputType = _.get(FBCheckControl, type as string);
    const control = <InputType {...{ name, onChange }} />;

    (label && _.isString(label)) && (
      label = <Text message={label as string} values={labelValues} />
    );

    return Component({
      ...(props as T),
      label,
      name,
      control,
    });
  };
};
