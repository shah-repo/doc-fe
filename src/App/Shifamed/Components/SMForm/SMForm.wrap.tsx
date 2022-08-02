import React, { useEffect } from "react";
import { SM, SMFormProps } from "../../..";

export const withSMFormWrap = <T extends SMFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    initialValidation = false,
    values,
    ...props
  }: T) => {

    // MARK: @config
    const { _formState } = SM.useStores();

    // MARK: @init
    useEffect(() => {
      _formState?.setValues(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (!initialValidation) { return; }
      _formState?.validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValidation]);

    // MARK: @state

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    return (
      <Component {...props as T} />
    );
  };

  Comp.displayName = "withSMFormWrap";
  return Comp;
};
