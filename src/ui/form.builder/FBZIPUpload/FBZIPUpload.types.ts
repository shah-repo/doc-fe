import { FBFileUploadState, FBInputProps } from '..';
import { Id } from '../../../state/ducks/common/types';

export enum FBUnzipStatus {
  FAILED = 'FAILED',
  DONE = 'DONE',
  PROCESSING = 'PROCESSING',
}

export type FBFZIPUploadProps =
& FBInputProps
& {
  fileUploadState?: FBFileUploadState;
  readonly?: boolean;
  files?: Id[];
  disableFileUpload: boolean;
  startUnzip: () => void;
  docRevisionId: string;
  unzipStatus?: string;
  disableUnzipButton: boolean;
};

