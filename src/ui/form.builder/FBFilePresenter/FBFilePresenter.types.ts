import { FBContextMenuProps, FBInputProps, FBProviderProps } from "..";
import { Attachment } from "../../../state/ducks/attachments";

export type FBFilePresenterDownloadType = "download" | "view";

export type FBAttachment = Attachment & {
  url?: string;
};

export type FBFilePresenterProps =
& Pick<FBInputProps, "name" | "disabled">
& Pick<FBContextMenuProps, "menuItems">
& Pick<FBProviderProps, "filePresenterState" | "dialogState">
& {
  handleDownload?: (type: FBFilePresenterDownloadType) => any;
  handleRemove?: () => any;
  file: FBAttachment;
  fileName?: string;
  fileShortName?: string;
  fileType?: string;
  loading?: boolean;
};
