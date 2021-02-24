import { Box, Typography } from "@material-ui/core";
import React from "react";
import { DocumentRevision, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions/types";
import AttachmentDownloadAllButton from "../../components/common/attachment.downloadAll/AttachmentDownloadAllButton";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import Text from "../../components/Text";

interface Props {
  isDisabled: boolean;
  isNewVersion: boolean;
  isAttachmentEmpty: boolean;
  docRevId: string;
  containsRedline: boolean;
  docRevStatus: DocumentRevisionStatus;
  documentRevision: DocumentRevision;
}

const classes = {
  attachmentHeaderConatainer: {
    display: "flex",
  },
  attachmentHeadText: {
    flex: "0 0 50%",
    display: "flex",
    justifyContent: "flex-start",
  },
};

const Attachments: React.FunctionComponent<Props> = ({
  isDisabled = false,
  isNewVersion,
  isAttachmentEmpty,
  docRevId,
  containsRedline,
  docRevStatus,
  documentRevision,
}) => (
  <Box marginBottom="33px">
    <Box style = {classes.attachmentHeaderConatainer} id="attachmentHeader">
      <Typography variant="h6" style = {classes.attachmentHeadText}>
        <Text message="common.attachments"/>
      </Typography>
      <AttachmentDownloadAllButton
        isAttachmentEmpty = {isAttachmentEmpty}
        docRevId = {docRevId}
        containsRedline={containsRedline}
        docRevStatus = {docRevStatus}/>
    </Box>
    <AttachmentField name="attachments" component="field" disabled={isDisabled}/>
    <AttachmentIconField name="attachments" {...{ isNewVersion, documentRevision }}/>
  </Box>
);

export default React.memo(Attachments);
