import { FBDialogState, FBFieldWrapperState, FBInlineApprovalState, FBMediaAlbumState } from "..";

export interface FBProviderProps {
  dialogState?: FBDialogState;
  fieldWrapper?: FBFieldWrapperState;
  mediaAlbumState?: FBMediaAlbumState;
  inlineApprovalState?: FBInlineApprovalState;
}
