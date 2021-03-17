import { FBFileUploadState, FBInputProps } from "..";
import { Id } from "../../../state/ducks/common/types";

export type FBFileUploadProps =
& FBInputProps
& {
  fileUploadState?: FBFileUploadState;
  readonly?: boolean;
  files?: Id[];
  mode?: FBFileFieldType;
};

export type FBFileFieldType = "fileUploadIcon" | "fileUpload";
