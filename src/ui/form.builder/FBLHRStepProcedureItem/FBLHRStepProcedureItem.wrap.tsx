import { cloneDeep } from "lodash";
import React from "react";
import { FB, FBDialogState, FBFormMode, FBProcedureForm, FBProcedureItemConfig, FBProcedureItemLocale } from "..";
import { FBLHRStepProcedureItemProps } from "./FBLHRStepProcedureItem.types";

export const withFBLHRStepProcedureItem = <T extends FBLHRStepProcedureItemProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    dialogState,
    lhrStepIndex,
    type,
    getItem,
    ...props
  }: T) => {
    const { lhrStepState } = FB.useStores();
    dialogState = FB.useRef(FBDialogState);

    getItem = (id: string): string => lhrStepState?.getItem(id, type) || "";

    onClick = (part?: FBProcedureItemConfig) => {
      dialogState?.config({
        open: true,
        title: {
          locale: "form.builder.action.mode",
          values: {
            mode: part ? FBFormMode.edit : FBFormMode.add,
            title: `${FBProcedureItemLocale[type]}|s`,
          },
        },
        content: (
          <FBProcedureForm
            initialValues={cloneDeep(part)}
            mode="lhr"
            {...{ type, lhrStepIndex }}
          />
        ),
      });
    };

    return Component({
      ...(props as T),
      onClick,
      getItem,
      dialogState,
      type,
    });
  };

  Comp.displayName = "withFBLHRStepProcedureItem";
  return Comp;
};
