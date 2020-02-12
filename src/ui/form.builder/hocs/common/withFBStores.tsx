import React from "react";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
import { FBStoreProps } from "../../types/store";

export const withFBStores = <T extends FBStoreProps>(
  Component: React.FunctionComponent<T>,
) => {
  return (props: T) => {
    return Component({
      ...(props as T),
      dynamicValidatorStore: FBDynamicValidatorStore,
    });
  };
};
