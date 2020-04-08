import React from "react";
import { FB, FBTestStepState } from "..";
import { FBTestStepProps } from "./FBTestStep.types";

export const withFBTestStep = <T extends FBTestStepProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    testStepState,
    ...props
  }: T) => {

    testStepState = FB.useRef<FBTestStepState>(FBTestStepState);

    return Component({
      ...(props as T),
      schema: testStepState.schema,
    });
  };
  return (props: T) => Comp(props);
};
