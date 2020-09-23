import { get } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBFormState, FBProcedureForm, FBProcedureFormActions, FBProcedureItemActionLocale, FBProcedureItemConfig, FBProcedureItemProps } from "..";

export const withFBProcedureItem = <T extends FBProcedureItemProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    handleAdd,
    handleCancel,
    handleRemove,
    dialogState,
    formState,
    name,
    type,
    value,
    ...props
  }: T) => {

    // MARK: @config
    const { procedureState } = FB.useStores();
    dialogState = FB.useRef(FBDialogState);
    formState = FB.useRef<FBFormState>(FBFormState, {});

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods
    onClick = () => dialogState?.config({
      open: true,
      title: FBProcedureItemActionLocale[type],
      content: (
        <FBProcedureForm
          {...{ formState, name, type }}
        />
      ),
      actions: <FBProcedureFormActions {...{ handleAdd, handleCancel }} />,
    });

    handleAdd = () => {
      const formValue = formState?.getValues() as FBProcedureItemConfig;
      procedureState?.addItem(formValue, type);
      formState?.reset();
      handleCancel?.();
    };

    handleCancel = () => dialogState?.closeDialog();
    handleRemove = (id: string) => procedureState?.removeItem(id, type);

    // MARK: @observer
    useObserver(() => {
      value = get(procedureState, type);
    });

    return Component({
      ...(props as T),
      onClick,
      handleRemove,
      dialogState,
      formState,
      name,
      type,
      value,
    });
  };

  Comp.displayName = "withFBProcedureItem";
  return Comp;
};
