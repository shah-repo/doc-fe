import { map } from "lodash";
import React from "react";
import { FB, FBAutocompleteAsyncOption, FBFormState, FBProcedureFormActions, FBProcedureFormProps, FBProcedureItemConfig, FBProcedureItemType } from "..";

export const withFBProcedureForm = <T extends FBProcedureFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    formState,
    disabledOptions,
    initialValues,
    optionId,
    type,
    ...props
  }: T) => {

    // MARK: @config
    const { procedureState, dialogState } = FB.useStores();
    formState = FB.useRef<FBFormState>(FBFormState, { initialValues });

    const config: Partial<Record<keyof typeof FBProcedureItemType, (() => void)>> = {
      materials: () => {
        optionId = FBAutocompleteAsyncOption.materials;
        disabledOptions = map(procedureState?.value?.materials, "title");
      },
      equipment: () => {
        optionId = FBAutocompleteAsyncOption.equipment;
        disabledOptions = map(procedureState?.value?.equipment, "title");
      },
    };
    config[type]?.();

    React.useEffect(() => {
      dialogState?.setActions(
        <FBProcedureFormActions {...{ handleAdd, handleCancel }} />
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // MARK: @reactions

    // MARK: @helpers
    function handleAdd() {
      const formValue = formState?.getValues() as FBProcedureItemConfig;
      procedureState?.addItem(formValue, type);
      handleCancel?.();
    };

    function handleCancel() {
      dialogState?.closeDialog();
    }

    // MARK: @methods

    // MARK: @observer

    return Component({
      ...(props as T),
      formState,
      disabledOptions,
      initialValues,
      optionId,
      type,
    });
  };

  Comp.displayName = "withFBProcedureForm";
  return Comp;
};
