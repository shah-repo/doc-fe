import { map } from "lodash";
import React from "react";
import { FB, FBAutocompleteAsyncOption, FBProcedureFormProps, FBProcedureItemType } from "..";

export const withFBProcedureForm = <T extends FBProcedureFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    disabledOptions,
    initialValues,
    optionId,
    type,
    ...props
  }: T) => {

    // MARK: @config
    const { procedureState } = FB.useStores();

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

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer

    return Component({
      ...(props as T),
      disabledOptions,
      initialValues,
      optionId,
      type,
    });
  };

  Comp.displayName = "withFBProcedureForm";
  return Comp;
};
