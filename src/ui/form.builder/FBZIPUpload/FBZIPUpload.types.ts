import { FBFileUploadState, FBInputProps } from "..";
import { Id } from "../../../state/ducks/common/types";

export type FBFZIPUploadProps =
& FBInputProps
& {
  fileUploadState?: FBFileUploadState;
  readonly?: boolean;
  files?: Id[];
  disableFileUpload: boolean;
  startUnzip: () => void;
  docRevisionId: string;
};

