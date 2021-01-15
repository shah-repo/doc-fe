import { BoxProps } from "@material-ui/core";
import { FBContextMenuProps, FBInputProps, FBProviderProps } from "..";
import { Attachment } from "../../../state/ducks/attachments";

export type FBFilePresenterDownloadType = "download" | "view";

export type FBAttachment = Attachment & {
  url?: string;
};

export enum FBFilePresenterColor {
  "PDF" = "#BD0100",
  "DOCX" = "#3A68AF",
  "XLS" = "#178F3C",
  "ZIP" = "#9D7120",
  "GIF" = "#00477D",
  "JPG" = "#389FED",
  "RTF" = "#9187C4",
  "AVI" = "#63B17B",
  "CSS" = "#6A5CAF",
  "BIN" = "#3BA8FA",
  "MPEG" = "#157A80",
  "HTML" = "#29D2DB",
  "SVG" = "#EFAB2F",
  "RAR" = "#620553",
  "PNG" = "#3BA8FA",
  "MOV" = "#CF3D00",
  "PPT" = "#FF822E",
  "CSV" = "#FF822E",
  "TXT" = "#1A8187",
  "DWT" = "#77B75A",
  "WAV" = "#08551F",
  "XD" = "#6F0A58",
}

export type FBFilePresenterMode = "raw" | "icon";

export type FBFilePresenterProps =
& Pick<FBInputProps, "name" | "disabled">
& Pick<FBContextMenuProps, "menuItems">
& Pick<FBProviderProps, "filePresenterState" | "dialogState">
& Pick<BoxProps, "onMouseOver" | "onMouseLeave">
& {
  handleDownload?: (type: FBFilePresenterDownloadType) => any;
  handleIconClick?: () => any;
  handleRemove?: () => any;
  toolsVisible?: boolean;
  file: FBAttachment;
  fileName?: string;
  fileShortName?: string;
  fileType?: string;
  fileSize?: string;
  fileDescription?: string;
  fileColor?: string;
  loading?: boolean;
  mode?: FBFilePresenterMode;
};
