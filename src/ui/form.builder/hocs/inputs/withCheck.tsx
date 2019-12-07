import _ from "lodash";
import React from "react";
import Text from "../../../components/Text";
import { FBCheckboxProps } from "../../types/inputs/checkbox";

export const withCheck = <T extends FBCheckboxProps>(
  Component: React.FunctionComponent<T>,
) => {
  return ({
    label,
    labelValues,
    ...props
  }: T) => {

    (label && _.isString(label)) && (
      label = <Text message={label as string} values={labelValues} />
    );

    return Component({
      ...(props as T),
      label,
    });
  };
};
