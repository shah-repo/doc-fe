import MuiDialogContent from '@material-ui/core/DialogContent';
import React, { useEffect, useState } from 'react';
import PrismaZoom from 'react-prismazoom';
import AsyncGate from '../../../AsyncGate';
import Text from '../../../Text';
import { IMAGE, PDF, SUPPORTED_IMAGE_FILES, SUPPORTED_VIDEO_FILES, VIDEO } from '../utils/constants';
import { styles } from '../utils/styles';
import { ViewFileContentProps } from '../utils/types';

const ViewFileContent: React.FunctionComponent<ViewFileContentProps> = ({
  asyncState,
  url,
  type,
  handleClose,
}) => {
  type = type.toLowerCase();
  const classes = styles();
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    if (SUPPORTED_VIDEO_FILES.includes(type)) {
      setFileType(VIDEO);
      return;
    }
    if (SUPPORTED_IMAGE_FILES.includes(type)) {
      setFileType(IMAGE);
      return;
    }
    if (type === PDF) {
      setFileType(PDF);
      return;
    }
  }, [url, type]);

  const renderVideo = fileType === VIDEO && (
    <video controls={true} width="100%" height="95%" src={url}>
      <Text translation="file.viewer.video.not.supported" />
    </video>
  );
  const renderPDF = fileType === PDF && (
    <object width="100%" height="100%" type="application/pdf" data={url}>
      <Text translation="common.file.not.loaded" />
    </object>
  );
  const renderImage = fileType === IMAGE && (
    <PrismaZoom
      className={classes.zoom}
      topBoundary={180}
    >
      <img src={url} alt={url} width="100%" />
    </PrismaZoom>
  );

  const handleClick = (evt) => {
    if (evt.target.tagName === 'DIV') {
      handleClose();
    }
  };

  return (
    <MuiDialogContent
      className={classes.content}
      classes={{ root: classes.contentRoot }}
      onClick={handleClick}
    >
      <AsyncGate asyncState={asyncState}>
        {renderVideo}
        {renderPDF}
        {renderImage}
      </AsyncGate>
    </MuiDialogContent>
  );
};

export default ViewFileContent;
