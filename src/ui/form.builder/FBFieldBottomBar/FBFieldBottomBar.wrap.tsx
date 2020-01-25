import React from "react";
import { FBFieldBottomBarProps } from ".";
import editorStore from "../stores/ui/FBEditorStore";

export const withFBFieldBottomBar = <T extends FBFieldBottomBarProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    index = 0,
    ...props
  }: T) => {

    return Component({
      ...(props as T),
      onClick: editorStore.setOpen(index),
    });
  };

  return (props: T) => Comp(props);
};
