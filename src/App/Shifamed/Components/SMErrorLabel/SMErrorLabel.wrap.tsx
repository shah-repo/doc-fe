import { useObserver } from "mobx-react";
import React from "react";
import { SMErrorLabelProps } from "../../..";

export const withSMErrorLabel = <T extends SMErrorLabelProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    error,
    name,
    ...props
  }: T) => {

    // MARK: @config
    // const { formState } = SM.useStores();

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer
    useObserver(() => {
      if (!name) { return; }
      // error = formState?.errors.get(name);
    });

    return (
      <Component
        {...props as T}
        {...{ error }}
      />
    );
  };

  Comp.displayName = "withSMErrorLabel";
  return Comp;
};
