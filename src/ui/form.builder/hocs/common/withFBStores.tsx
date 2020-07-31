import React from "react";
import FBDynamicValidatorStore from "../../stores/ui/FBDynamicValidatorStore";
import { FBStoreProps } from "../../types/store";

export const withFBStores = <T extends FBStoreProps>(
  Component: React.FunctionComponent<T>,
) => (props: T) => Component({
  ...(props),
  dynamicValidatorStore: FBDynamicValidatorStore,
});
