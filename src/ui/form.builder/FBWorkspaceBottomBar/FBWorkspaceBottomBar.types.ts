import { BoxProps } from "@material-ui/core";
import { FBFormProps, FBWorkspaceProps } from "..";

export type FBWorkspaceBottomBarProps =
& Pick<FBWorkspaceProps, "includeTransport">
& Pick<FBFormProps, "children">
& BoxProps
& {
  handleFormPreview?: () => any;
  importSchema?: (event: React.ChangeEvent<HTMLInputElement>) => any;
  exportSchema?: () => any;
  previewDisabled?: boolean;
};
