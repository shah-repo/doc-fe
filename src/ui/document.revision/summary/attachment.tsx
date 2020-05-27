import { Box, Typography } from "@material-ui/core";
import React from "react";
import AttachmentField from "../../components/common/attachment.icon/container";
import Text from "../../components/Text";

export interface Props {
  isAttachmentEmpty: boolean;
}

export const Attachment: React.FunctionComponent<Props> = ({ isAttachmentEmpty }) => {
  const emptyAttachmentsRenderer = isAttachmentEmpty && (
    <Typography variant="h5" style={{ marginTop: "24px" }}>
      <Text message="common.no.attachments"/>
    </Typography>
  );
  return (
    <Box pl={2}>
      <Typography variant="h6">
        <Text message="common.attachments"/>
      </Typography>
      <AttachmentField name="attachments" disabled={true} />
      {emptyAttachmentsRenderer}
    </Box>
  ); };

export default Attachment;
