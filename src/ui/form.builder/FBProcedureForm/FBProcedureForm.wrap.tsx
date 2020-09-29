import { map } from "lodash";
import React from "react";
import { FB, FBAutocompleteAsyncOption, FBProcedureFormProps, FBProcedureItemType } from "..";

export const withFBProcedureForm = <T extends FBProcedureFormProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    disabledOptions,
    optionId,
    type,
    ...props
  }: T) => {

    // MARK: @config
    const { procedureState } = FB.useStores();

    const config: Record<FBProcedureItemType, (() => void)> = {
      materials: () => {
        optionId = FBAutocompleteAsyncOption.materials;
        disabledOptions = map(procedureState?.value?.materials, "title");
      },
      equipment: () => {
        optionId = FBAutocompleteAsyncOption.equipment;
        disabledOptions = map(procedureState?.value?.equipment, "title");
      },
    };
    config[type]();

    // MARK: @reactions

    // MARK: @helpers

    // MARK: @methods

    // MARK: @observer

    return Component({
      ...(props as T),
      disabledOptions,
      optionId,
      type,
    });
  };

  Comp.displayName = "withFBProcedureForm";
  return Comp;
};
