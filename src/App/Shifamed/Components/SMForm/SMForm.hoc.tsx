import React from "react";
import { SM, SMFormHOCProps, SMFormState, SMProvider } from "../../..";

export const withSMForm = <T extends SMFormHOCProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    _formState,
    ...props
  }: T) => {

    _formState = SM.useRef(SMFormState);

    return (
      <SMProvider {...{ _formState }}>
        <Component {...props as T} {...{ _formState }} />
      </SMProvider>
    );
  };

  Comp.displayName = "withSMForm";
  return Comp;
};
