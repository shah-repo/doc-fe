import { BoxProps } from "@material-ui/core";
import { SMProviderProps, SMTemplateProps } from "../../..";

export type FormFooterProps =
& Pick<SMProviderProps, "_formFooterState">
& Pick<SMTemplateProps, "children">
& {
  boxProps?: BoxProps;
};

export interface FormFooterStateProps {
  setHidden: (hidden: boolean) => void;
  hidden: boolean;
}
