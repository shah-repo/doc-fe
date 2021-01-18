import { FBFilePresenterProps, FBInputProps, FBProviderProps } from "..";
import { Id } from "../../../state/ducks/common";
import { FBAttachment } from "../FBFilePresenter";

export type FBFilesPresenterProps =
& Pick<FBInputProps, "boxProps">
& Pick<FBProviderProps, "filesPresenterState">
& Pick<FBFilePresenterProps, "mode">
& {
  files?: Id[];
  attachments?: FBAttachment[];
};
