import { reaction } from "mobx";
import React from "react";
import { FB, FBLHRStepProps } from "..";

export const withFBLHRStep = <T extends FBLHRStepProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name,
    ...props
  }: T) => {
    const { formState } = FB.useStores();
    React.useEffect(() => reaction(
      () => formState?.inputState.get(`fb-lhrstep-${name}`)?.value,
      (data) => {
        console.log(data);
      }
    ));
    return Component({
      ...(props as T),
      name,
    }); };

  Comp.displayName = "withFBLHRStep";
  return Comp;
};
