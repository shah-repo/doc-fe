import { LinearProgress } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import {
  FBFilePreview,
} from '../../../../../../../../ui/form.builder';
import useStyle from './styles';
import { OCRFilePresenterProps } from './types';
import { withOCRFilePresenter } from './wrap';

const OCRFilePresenter: React.FC<OCRFilePresenterProps> = ({
  file,
  isLoading,
  isSupportedFileType,
}) => {
  const classes = useStyle();

  if (isLoading) {
    return <LinearProgress className={classes.progress} />;
  }

  if (!isSupportedFileType) {
    return <span>{translate('ocr.file.preview.not.support.message')}</span>;
  }

  return <FBFilePreview file={file} />;
};

export default withOCRFilePresenter(OCRFilePresenter);
