import { Box, Typography } from "@material-ui/core";
import React from "react";
import { DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import AttachmentDownloadAllButton from "../../components/common/attachment.downloadAll/AttachmentDownloadAllButton";
import AttachmentField from "../../components/common/attachment.icon/container";
import Text from "../../components/Text";

export interface Props {
  isAttachmentEmpty: boolean;
  docRevId: string;
  containsRedline: boolean;
  docRevStatus: DocumentRevisionStatus;
}

export const Attachment: React.FunctionComponent<Props> = ({ isAttachmentEmpty, docRevId, containsRedline, docRevStatus }) => {

  const classes = {
    buttonsContainer: {
      display: "flex",
    },
    buttonLeft: {
      flex: "0 0 50%",
      display: "flex",
      justifyContent: "flex-start",
    },

    buttonRight: {
      flex: "0 0 50%",
      display: isAttachmentEmpty ? "none" : "flex",
      justifyContent: "flex-end",
      paddingRight: "25px",
      cursor: "pointer",
    },
    icon: {
      verticalAlign: "middle",
    },
  };

  const emptyAttachmentsRenderer = isAttachmentEmpty && (
    <Typography variant="h5" style={{ marginTop: "24px" }}>
      <Text message="common.no.attachments"/>
    </Typography>
  );
  return (
    <Box pl={2}>
      <Box style = {classes.buttonsContainer}>
        <Typography variant="h6" style = {classes.buttonLeft}>
          <Text message="common.attachments"/>
        </Typography>
        <AttachmentDownloadAllButton
          isAttachmentEmpty = {isAttachmentEmpty}
          docRevId = {docRevId}
          containsRedline = {containsRedline}
          docRevStatus = {docRevStatus}/>
      </Box>
      <AttachmentField name="attachments" disabled={true} />
      {emptyAttachmentsRenderer}
    </Box>
  ); };

export default Attachment;
