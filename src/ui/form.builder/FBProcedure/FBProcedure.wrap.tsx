import { reaction } from "mobx";
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
    // Value sync with the form
    React.useEffect(() => reaction(
      () => procedureState?.value,
      (data) => formState?.setFieldValue(name, data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);


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
