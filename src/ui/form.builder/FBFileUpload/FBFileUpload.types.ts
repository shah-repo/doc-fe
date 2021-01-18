import { FBFileUploadState, FBInputProps } from "..";
import { Id } from "../../../state/ducks/common";

export type FBFileUploadProps =
& FBInputProps
& {
  fileUploadState?: FBFileUploadState;
  readonly?: boolean;
  files?: Id[];
};
