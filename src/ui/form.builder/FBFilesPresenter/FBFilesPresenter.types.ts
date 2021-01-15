import { FBFilePresenterProps, FBProviderProps } from "..";
import { Id } from "../../../state/ducks/common";
import { FBAttachment } from "../FBFilePresenter";

export type FBFilesPresenterProps =
& Pick<FBProviderProps, "filesPresenterState">
& Pick<FBFilePresenterProps, "mode">
& {
  files?: Id[];
  attachments?: FBAttachment[];
};
