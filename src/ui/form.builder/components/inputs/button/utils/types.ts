import { ButtonProps } from "@material-ui/core/Button";
import { PropTypes } from "@material-ui/core";
export interface FBButtonProps {
  variant: ButtonProps["variant"];
  color: PropTypes.Color;
  label: string;
}
