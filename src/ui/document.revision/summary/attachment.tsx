import { Box, Typography } from "@material-ui/core";
import React from "react";
import AttachmentField from "../../components/common/attachment.icon/container";
import Text from "../../components/Text";

interface Props {
  isAttachmentEmpty: boolean;
}

export const Attachment: React.FunctionComponent<Props> = ({ isAttachmentEmpty }) => {
  const emptyAttachmentsRenderer = () => (
    <Typography variant="h5" style={{ marginTop: "24px" }}>
      <Text message="common.no.attachments"/>
    </Typography>
  );
  return (
    <Box pl={2}>
      <Typography variant="h5" style={{ fontWeight: "bold" }}>
        <Text message="common.attachments"/>
      </Typography>
      <AttachmentField name="attachments" disabled={true} />
      {isAttachmentEmpty && emptyAttachmentsRenderer()}
    </Box>
  ); };

export default Attachment;
