import { reaction } from "mobx";
import React from "react";
import { FB, FBInputProps } from "..";

export const withFBRange = <T extends FBInputProps>(
  Component: React.FunctionComponent,
) => {
  const Comp = ({
    name,
    ...props
  }) => {
    
    // MARK: @config
    const { formState } = FB.useStores();

    // MARK: @reactions
    // Handle value
    React.useEffect(() => reaction(
      () => formState?.inputState.get(`${name}.from`)?.value,
      (from: number) => {
        if (!formState?.inputState.get(`${name}.to`)?.value) {
          formState?.setFieldValue(name, undefined);
          return;
        }
        formState.setFieldValue(name, {
          from,
          to: formState?.inputState.get(`${name}.to`)?.value,
        })
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    React.useEffect(() => reaction(
      () => formState?.inputState.get(`${name}.to`)?.value,
      (to: number) => {
        if (!formState?.inputState.get(`${name}.from`)?.value) {
          formState?.setFieldValue(name, undefined);
          return;
        }
        formState.setFieldValue(name, {
          from: formState?.inputState.get(`${name}.from`)?.value,
          to,
        })
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer


    
    return Component({
      ...(props as T),
      name,
    });
  };

  Comp.displayName = "withFBRange";
  return Comp;
};
