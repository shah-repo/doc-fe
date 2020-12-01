import React from "react";
import { FB, FBButtonProps } from "..";

export const withFBSubmitButton = <T extends FBButtonProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    ...props
  }: T) => {

    const { formState } = FB.useStores();

    const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      formState?.validate((valid) => {
        valid && props.onClick && props.onClick(event);
      }, true);
    };

    return Component({
      ...(props),
      onClick,
    });
  };
  return (props: T) => Comp(props);
};
