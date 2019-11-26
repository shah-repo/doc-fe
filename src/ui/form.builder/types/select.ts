import { SelectProps } from "@material-ui/core/Select";
import {
  FBFormDefaultProps,
  FBLabelRendererProps,
  FBOnChangeProps,
} from "./common";

export interface FBSelectInjectedProps extends FBLabelRendererProps  {
  emptyItem?: JSX.Element;
  items: JSX.Element[];
}

export type FBSelectProps =
  & Pick<SelectProps, "variant">
  & FBFormDefaultProps
  & FBSelectInjectedProps
  & FBOnChangeProps
  & {
  includeEmpty?: boolean;
  showNote?: boolean;
};
