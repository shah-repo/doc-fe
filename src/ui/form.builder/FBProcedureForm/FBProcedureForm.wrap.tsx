import React from "react";
import { FBAutocompleteAsyncOption, FBProcedureFormProps } from "..";

export const withFBProcedureForm = <T extends FBProcedureFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    optionId,
    type,
    ...props
  }: T) => {

    // MARK: @config
    optionId = type === "materials"
      ? FBAutocompleteAsyncOption.materials
      : FBAutocompleteAsyncOption.equipment;
    // MARK: @reactions


    // MARK: @helpers


    // MARK: @methods

    // MARK: @observer

    return Component({
      ...(props as T),
      optionId,
      type,
    });
  };

  Comp.displayName = "withFBProcedureForm";
  return Comp;
};
