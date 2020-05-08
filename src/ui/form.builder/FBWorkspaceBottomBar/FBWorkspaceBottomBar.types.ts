import { FBWorkspaceProps } from "..";
import { FBFormProps } from "../FBForm";


export type FBWorkspaceBottomBarProps =
& Pick<FBWorkspaceProps, "includeTransport">
& Pick<FBFormProps, "children">
& {
  handleFormPreview?: () => any;
  importSchema?: (event: React.ChangeEvent<HTMLInputElement>) => any;
  exportSchema?: () => any;
  previewDisabled?: boolean;
};
