import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBProcedureItemType } from "..";
import FBAutocompleteAsyncStore from "../FBAutocompleteAsync/FBAutocompleteAsync.store";
import { FBPartsItemProps } from "./FBPartsItem.types";


export const withFBPartsItem = <T extends FBPartsItemProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    getItem,
    getLot,
    getItemUrl,
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
    getLot = (id?: string): string => partsState?.getLot(id) || "";

    getItemUrl = (id: string) => partsState?.getItemUrl(id, type);

    // MARK: @observer
    useObserver(() => {
      const observables: Partial<Record<keyof typeof FBProcedureItemType, (() => void)>> = {
        materials: () => {
          loading = !FBAutocompleteAsyncStore.data.get(partsState?.materialsId || "");
          collection = partsState?.materials;
        },
        equipment: () => {
          loading = !FBAutocompleteAsyncStore.data.get(partsState?.equipmentId || "");
          collection = partsState?.equipment;
        },
      };
      observables[type]?.();
    });

    return Component({
      ...(props as T),
      getItem,
      getLot,
      getItemUrl,
      collection,
      type,
    });
  };

  Comp.displayName = "withFBPartsItem";
  return Comp;
};
