import { FBInputProps } from "..";
import { Id } from "../../../state/ducks/common/types";
import FBZIPUploadState from "./FBZIPUpload.state";

export type FBFZIPUploadProps =
& FBInputProps
& {
  fileUploadState?: FBZIPUploadState;
  readonly?: boolean;
  files?: Id[];
  disableFileUpload: boolean;
};

