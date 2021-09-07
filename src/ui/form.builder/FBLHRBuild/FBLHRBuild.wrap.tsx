import { get } from "lodash";
import { reaction } from "mobx";
import React, { useEffect } from "react";
import { FB, FBLHRBuildOption, FBLHRBuildProps, FBLHRBuildState } from "..";
import { SMDialogAction } from "../../../App";
import { withSMDialog } from "../../../App/Shifamed/Components/SMDialog/SMDialog.hoc";

export const withFBLHRBuild = <T extends FBLHRBuildProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onChange,
    onDialogActionClick,
    lhrBuildState,
    dialogState,
    name = "",
    disabled,
    ...props
  }: T) => {

    // MARK: @config
    const { workspaceState, formState } = FB.useStores();
    lhrBuildState = FB.useRef(FBLHRBuildState, {
      value: formState?.getFieldValue(name),
      disabled,
    });

    useEffect(() => {
      const isOutput = workspaceState?.isOutput;
      const savedData = get(workspaceState?.document?.formInput, name);
      if (isOutput && (savedData as FBLHRBuildOption) === "R&D") {
        lhrBuildState?.setDisabled(true);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @helpers
    function save() {
      workspaceState?.saveDocRev(formState?.getValues());
    }

    // MARK: @reactions

    // MARK: @methods
    onChange = (_event: React.ChangeEvent<HTMLInputElement>, value: string) => {
      const formValue = formState?.getFieldValue(name);
      if ((value as FBLHRBuildOption) === "R&D" && (formValue as FBLHRBuildOption) === "Production") {
        lhrBuildState?.setValue("Production");
        dialogState?.setOpen?.(true);
        return;
      }
      const isDisabled = (value as FBLHRBuildOption) === "R&D";
      lhrBuildState?.setDisabled(isDisabled);
      formState?.setFieldValue(name, value);
      save();
    };

    onDialogActionClick = (action: SMDialogAction) => {
      if (action === SMDialogAction.close) {
        lhrBuildState?.setValue(formState?.getFieldValue(name));
        return;
      }
      lhrBuildState?.setValue("R&D");
    };

    useEffect(() => reaction(
      () => lhrBuildState?.value,
      (value) => {
        formState?.setFieldValue(name, value);
        save();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ), []);

    return Component({
      ...(props as T),
      onChange,
      onDialogActionClick,
      lhrBuildState,
      name,
    });
  };

  Comp.displayName = "withFBLHRBuild";
  return withSMDialog((props: T) => Comp(props));
};
