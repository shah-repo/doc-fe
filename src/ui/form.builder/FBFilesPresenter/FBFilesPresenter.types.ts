import { FBAttachment, FBFilePresenterProps, FBInputProps, FBProviderProps } from "..";
import { Id } from "../../../state/ducks/common/types";

export type FBFilesPresenterProps =
& Pick<FBInputProps, "boxProps" | "disabled">
& Pick<FBProviderProps, "filesPresenterState">
& Pick<FBFilePresenterProps, "mode">
& {
  files?: Id[];
  attachments?: FBAttachment[];
};
