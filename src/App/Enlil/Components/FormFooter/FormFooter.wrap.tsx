import React from "react";
import { FormFooterProps, SM, SMProvider } from "../../..";
import FormFooterState from "./FormFooter.state";

export const withFormFooterWrap = <T extends FormFooterProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    _formFooterState,
    ...props
  }: T) => {

    // MARK: @config
    _formFooterState = SM.useRef(FormFooterState);

    // MARK: @state

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    return (
      <SMProvider {...{ _formFooterState }}>
        <Component
          {...props as T}
          {...{ _formFooterState }}
        />
      </SMProvider>
    );
  };

  Comp.displayName = "withFormFooterWrap";
  return (props: T) => Comp(props);
};
