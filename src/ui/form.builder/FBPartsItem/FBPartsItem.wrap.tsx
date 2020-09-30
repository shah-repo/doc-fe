import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBProcedureItemType } from "..";
import { store } from "../../../state/store";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";
import { FBPartsItemProps } from "./FBPartsItem.types";


export const withFBPartsItem = <T extends FBPartsItemProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    getItem,
    getLink,
    collection,
    loading,
    type,
    ...props
  }: T) => {

    // MARK: @config
    const { partsState } = FB.useStores();

    // MARK: Reactions


    // MARK: @helpers


    // MARK: @methods
    getItem = (id: string): string => partsState?.getItem(id, type) || "";

    getLink = (id: string) => store.getState().documentRevisions.byId[id]?.document?.id;

    // MARK: @observer
    useObserver(() => {
      const observables: Record<FBProcedureItemType, (() => void)> = {
        materials: () => {
          loading = !FBAutocompleteAsyncStore.data.get(partsState?.materialsId || "");
          collection = partsState?.materials;
        },
        equipment: () => {
          loading = !FBAutocompleteAsyncStore.data.get(partsState?.equipmentId || "");
          collection = partsState?.equipment;
        },
      };
      observables[type]();
    });

    return Component({
      ...(props as T),
      getItem,
      getLink,
      collection,
      type,
    });
  };

  Comp.displayName = "withFBPartsItem";
  return Comp;
};
