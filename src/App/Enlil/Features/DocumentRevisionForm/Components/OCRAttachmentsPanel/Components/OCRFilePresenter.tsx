import { LinearProgress, makeStyles } from '@material-ui/core';
import React, { Dispatch, SetStateAction } from 'react';
import { translate } from '../../../../../../../common/intl';
import { FBAttachment, FBFilePresenterDownloadType, FBFilePresenterState, FBFilePreview } from '../../../../../../../ui/form.builder';
import { withOCRFilePresenter } from './OCRFilePresenter.wrap';

export interface OCRFilePresenterProps {
  loadFIle?: () => any
  handleDownload?: (type: FBFilePresenterDownloadType) => any
  handleRemove?: () => any
  setFile?: Dispatch<SetStateAction<FBAttachment>>
  filePresenterState?: FBFilePresenterState
  loading?: boolean
  file: FBAttachment
  isSupportedFileType?: boolean
}

const useStyle = makeStyles((theme) => ({
  progress: {
    marginTop: theme.spacing(0.5),
  },
}));

const OCRFilePresenter: React.FunctionComponent<OCRFilePresenterProps> = ({ file, loading, isSupportedFileType }) => {
  const classes = useStyle();

  if (loading) {
    return (<LinearProgress className={classes.progress} />);
  }

  if (!isSupportedFileType) {
    return (<span>{translate('ocr.file.preview.not.support.message')}</span>);
  }

  return (
    <FBFilePreview file={file} />
  );
};

export default withOCRFilePresenter(OCRFilePresenter);
