import { ButtonProps } from "@material-ui/core/Button";
import { FBFormDefaultProps } from "./common";

export type FBButtonProps = ButtonProps &
  FBFormDefaultProps & {
    component?: (props: any) => JSX.Element;
  };
