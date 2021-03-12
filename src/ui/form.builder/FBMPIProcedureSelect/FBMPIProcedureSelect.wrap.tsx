import React from "react";
import { FB, FBFormState, FBMPIProcedureSelectProps, FBMPIProcedureSelectState, FBMPIProcedureSelectValue, FBProcedureFormActions } from "..";

export const withFBMPIProcedureSelect = <T extends FBMPIProcedureSelectProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    mpiProcedureSelectState,
    formState,
    initialValues,
    name = "",
    ...props
  }: T) => {
    // MARK: @config
    const { dialogState, workspaceState } = FB.useStores();
    formState = FB.useRef<FBFormState>(FBFormState, { initialValues });
    mpiProcedureSelectState = FB.useRef(FBMPIProcedureSelectState, initialValues?.id);
    const { id } = workspaceState || {};

    React.useEffect(() => {
      dialogState?.setActions(
        <FBProcedureFormActions {...{ handleAdd, handleCancel }} />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions

    // MARK: @helpers
    function handleAdd() {
      if (!id) { return; }
      const formValue = formState?.getValues() as FBMPIProcedureSelectValue;
      const { quantity, unit, usedLot } = formValue;
      mpiProcedureSelectState?.useLot(id, {
        fieldId: name,
        forMaterial: { id: initialValues?.id },
        quantity,
        unit,
        usedLot,
      });
      handleCancel?.();
    }

    function handleCancel() {
      dialogState?.closeDialog();
    }

    // MARK: @methods

    return Component({
      ...(props as T),
      mpiProcedureSelectState,
      formState,
      initialValues,
      name,
    });
  };

  Comp.displayName = "withFBMPIProcedureSelect";
  return Comp;
};
