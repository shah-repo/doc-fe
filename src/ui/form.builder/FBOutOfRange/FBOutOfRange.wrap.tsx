import { isEmpty } from "lodash";
import React from "react";
import { FB, FBOutOfRangeProps } from "..";


export const withFBOutOfRange = <T extends FBOutOfRangeProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    pass,
    parentName,
    ...props
  }: T) => {
    const { formState } = FB.useStores();

    const isInRange = (value) => !value || value === "" || ((!pass?.from || value >= pass?.from) && (!pass?.to || value <= pass?.to));

    if (!pass || isEmpty(pass) || isInRange(formState?.getFieldValue(parentName))) { return null; }

    return Component({
      ...(props as T),
    });
  };

  Comp.displayName = "withFBOutOfRange";
  return Comp;
};
