import { isEmpty } from "lodash";
import { useObserver } from "mobx-react";
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
    // MARK: @config
    const { formState } = FB.useStores();
    let isInRange = true;

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods
    const getIsInRange = (value) =>
      !value
      || value === ""
      || ((!pass?.from || value >= pass?.from) && (!pass?.to || value <= pass?.to));

    // MARK: @observer
    useObserver(() => {
      isInRange = getIsInRange(formState?.inputState.get(parentName || "")?.value);
    });


    if (!pass || isEmpty(pass) || isInRange) { return null; }

    return Component({
      ...(props as T),
    });
  };

  Comp.displayName = "withFBOutOfRange";
  return Comp;
};
