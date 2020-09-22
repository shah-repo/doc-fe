import React from "react";
import { FB, FBProcedureProps, FBProcedureState, FBProcedureValue } from "..";

export const withFBProcedure = <T extends FBProcedureProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    procedureState,
    isOutput,
    name,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    const formValue = formState?.getFieldValue(name) as FBProcedureValue;
    procedureState = FB.useRef(FBProcedureState, formValue);
    isOutput = Boolean(workspaceState?.isOutput && workspaceState?.id);


    // MARK: @reactions


    // MARK: @helpers


    // MARK: @methods

    // MARK: @observer


    return Component({
      ...(props as T),
      procedureState,
      isOutput,
      name,
    });
  };

  Comp.displayName = "withFBProcedure";
  return Comp;
};
