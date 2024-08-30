import { LinearProgress, makeStyles } from '@material-ui/core';
import React, { Dispatch, SetStateAction } from 'react';
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
}

const useStyle = makeStyles((theme) => ({
  progress: {
    marginTop: theme.spacing(0.5),
  },
}));

const OCRFilePresenter: React.FunctionComponent<OCRFilePresenterProps> = ({ file, loading }) => {
  const classes = useStyle();

  if (loading) {
    return (<LinearProgress className={classes.progress} />);
  }

  return (
    <FBFilePreview file={file} />
  );
};

export default withOCRFilePresenter(OCRFilePresenter);
