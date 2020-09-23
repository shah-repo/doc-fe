import React from "react";
import { FBProcedureFormProps } from "..";

export const withFBProcedureForm = <T extends FBProcedureFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    name,
    ...props
  }: T) =>

  // MARK: @config

  // MARK: @reactions


  // MARK: @helpers


  // MARK: @methods

  // MARK: @observer

    Component({
      ...(props as T),
      name,
    })
  ;

  Comp.displayName = "withFBProcedureForm";
  return Comp;
};
