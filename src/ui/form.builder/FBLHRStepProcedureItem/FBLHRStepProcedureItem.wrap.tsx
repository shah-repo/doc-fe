import { cloneDeep } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBDialogState, FBFormMode, FBProcedureForm, FBProcedureItemConfig, FBProcedureItemLocale, FBProcedureItemType } from "..";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";
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
    isPreview,
    loading,
    ...props
  }: T) => {
    const { lhrStepState, workspaceState } = FB.useStores();
    dialogState = FB.useRef(FBDialogState);
    isPreview = workspaceState?.document?.status !== DocumentRevisionStatus.Draft;
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
            initialValues={part?.paramsId ? cloneDeep(part) : { paramsId: part?.id }}
            mode="lhr"
            {...{ type, lhrStepIndex }}
          />
        ),
      });
    };

    useObserver(() => {
      const id = type === FBProcedureItemType.materials ? lhrStepState?.materialsId : lhrStepState?.equipmentId;
      loading = (!FBAutocompleteAsyncStore.data.get(id || ""));
    });

    return Component({
      ...(props as T),
      onClick,
      getItem,
      dialogState,
      type,
      isPreview,
      loading,
    });
  };

  Comp.displayName = "withFBLHRStepProcedureItem";
  return Comp;
};
