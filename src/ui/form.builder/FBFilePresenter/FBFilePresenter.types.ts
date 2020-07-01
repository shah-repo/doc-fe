import { FBContextMenuProps, FBFilePresenterState, FBInputProps } from "..";
import { Attachment } from "../../../state/ducks/attachments";

export type FBFilePresenterProps =
& Pick<FBInputProps, "name" | "disabled">
& Pick<FBContextMenuProps, "menuItems">
& {
  file: Attachment;
  fileName?: string;
  fileShortName?: string;
  fileType?: string;
  handleDownload?: () => any;
  handleRemove?: () => any;
  filePresenterState?: FBFilePresenterState;
};
