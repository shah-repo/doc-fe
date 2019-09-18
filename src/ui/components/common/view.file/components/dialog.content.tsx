import MuiDialogContent from "@material-ui/core/DialogContent";
import React from "react";
import AsyncGate from "../../../AsyncGate";
import Text from "../../../Text";
import { styles } from "../utils/styles";
import { ViewFileContentProps } from "../utils/types";

const ViewFileContent: React.FunctionComponent<ViewFileContentProps> = ({
  asyncState,
  url,
  type,
}) => {
  const classes = styles();
  const isVideo = type === "mp4";
  const isPDF = type === "pdf";

  const renderVideo = isVideo && (
    <video controls={true} width="100%" height="95%">
      <source src={url} type="video/mp4"/>
    </video>
  );
  const renderPDF = isPDF && (
    <object width="100%" height="100%" type="application/pdf" data={url}>
      <Text translation="common.file.not.loaded" />
    </object>
  );

  return (
    <MuiDialogContent className={classes.content}>
      <AsyncGate asyncState={asyncState}>
        {renderVideo}
        {renderPDF}
      </AsyncGate>
    </MuiDialogContent>
  );
};

export default ViewFileContent;
