import { useObserver } from "mobx-react";
import React from "react";
import { FBPassValueProps } from ".";
import { FB } from "..";

export const withFBPassValue = <T extends FBPassValueProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    isVisible,
    ...props
  }) => {
    // MARK: @config
    const { formState } = FB.useStores();
    let isTypePercentage = false;
    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer
    useObserver(() => {
      isTypePercentage = formState?.inputState.get("typeOfPassValue")?.value === "percentage";
    });

    if (!isVisible) {
      return null;
    }
    return Component({
      ...(props as T),
      formState,
      isTypePercentage,
    });
  };

  Comp.displayName = "withFBPassValue";
  return Comp;
};
