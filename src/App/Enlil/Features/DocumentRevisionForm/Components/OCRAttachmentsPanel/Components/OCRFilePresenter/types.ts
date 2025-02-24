import { Dispatch, SetStateAction } from 'react';
import { FBAttachment, FBFilePresenterDownloadType, FBFilePresenterState } from '../../../../../../../../ui/form.builder';

export interface OCRFilePresenterProps {
  loadFile?: () => void
  handleDownload?: (type: FBFilePresenterDownloadType) => void
  handleRemove?: () => void
  setFile?: Dispatch<SetStateAction<FBAttachment>>
  filePresenterState?: FBFilePresenterState
  isLoading?: boolean
  file: FBAttachment
  isSupportedFileType?: boolean
}
