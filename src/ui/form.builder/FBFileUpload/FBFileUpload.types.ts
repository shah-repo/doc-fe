import { FBFileUploadState, FBInputProps } from "..";

export type FBFileUploadProps =
& FBInputProps
& {
  filePresenters?: React.ReactNode[];
  fileUploadState?: FBFileUploadState;
  readonly?: boolean;
};
