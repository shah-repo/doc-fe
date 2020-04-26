import React from "react";
import { FBStarterProps } from ".";
import { FB, FBControlPicker } from "..";

export const withFBStarter = <T extends FBStarterProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    onClick,
    ...props
  }: T) => {

    const { dialogState } = FB.useStores();

    onClick = () => {
      dialogState?.config({
        open: true,
        content: <FBControlPicker />,
      });
    };

    return Component({
      ...(props as T),
      onClick,
    });

  };

  return (props: T) => Comp(props);
};
