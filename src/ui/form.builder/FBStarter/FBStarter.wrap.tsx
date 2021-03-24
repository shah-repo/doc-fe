import React from "react";
import { FB, FBControlPicker, FBStarterProps } from "..";

export const withFBStarter = <T extends FBStarterProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    ...props
  }: T) => {

    const { dialogState } = FB.useStores();

    onClick = (index?: number) => {
      dialogState?.config({
        open: true,
        maxWidth: "sm",
        content: <FBControlPicker {...{ index }} />,
      });
    };

    return Component({
      ...(props as T),
      onClick,
    });

  };

  return (props: T) => Comp(props);
};
