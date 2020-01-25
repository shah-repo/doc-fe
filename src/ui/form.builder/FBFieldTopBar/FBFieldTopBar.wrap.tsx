import { inject, useObserver } from "mobx-react";
import React from "react";
import { FBFieldTopBarProps } from ".";
import FBStore from "../stores/ui/FBStore";

export const withFBFieldTopBar = <T extends FBFieldTopBarProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    index = 0,
    fieldWrapper,
    ...props
  }: T) => {

    const editSchemaItem = () => FBStore.editSchemaItem(index);
    const removeSchemaItem = () => FBStore.removeSchemaItem(index);
    const markDownSchemaItem = () =>
      fieldWrapper?.setMarkDownActive(!fieldWrapper.markDownVisible);

    return useObserver(() => Component({
      ...(props as T),
      editSchemaItem,
      removeSchemaItem,
      markDownSchemaItem,
    }));
  };

  return inject("fieldWrapper")((props: T) => Comp(props));
};
