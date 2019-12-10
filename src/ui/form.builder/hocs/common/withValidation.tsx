import React from "react";
import { FBInputProps } from "../../types/common";

export const withValidation = <T extends FBInputProps>(
  Component: React.FunctionComponent<T>,
) => {
  return (props: T) => {
    const validate = (value: any) => {
      // tslint:disable-next-line: no-console
      console.log(`${props}- ${value}`);
    }

    return Component({
        ...(props as T),
        validate,
    });
  };
};
