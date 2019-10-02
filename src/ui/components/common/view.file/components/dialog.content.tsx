import MuiDialogContent from "@material-ui/core/DialogContent";
import React from "react";
import AsyncGate from "../../../AsyncGate";
import Text from "../../../Text";
import { SUPPORTED_IMAGE_FILES, SUPPORTED_VIDEO_FILES, PDF } from "../utils/constants";
import { styles } from "../utils/styles";
import { ViewFileContentProps } from "../utils/types";

const ViewFileContent: React.FunctionComponent<ViewFileContentProps> = ({
  asyncState,
  url,
  type,
}) => {
  const classes = styles();
  const isVideo = SUPPORTED_VIDEO_FILES.includes(type);
  const isImage = SUPPORTED_IMAGE_FILES.includes(type);
  const isPDF = type === PDF;

  const renderVideo = isVideo && (
    <video controls={true} width="100%" height="95%">
      <source src={url} type="video/mp4"/>
      <source src={url} type="video/webm"/>
      <source src={url} type="video/ogg"/>
      <source src={url} type="video/avi"/>
      <Text translation="file.viewer.video.not.supported" />
    </video>
  );
  const renderPDF = isPDF && (
    <object width="100%" height="100%" type="application/pdf" data={url}>
      <Text translation="common.file.not.loaded" />
    </object>
  );
  const renderImage = isImage && (
    <img src={url} />
  );

  return (
    <MuiDialogContent
      className={classes.content}
      classes={{ root: classes.contentRoot }}
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
