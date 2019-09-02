import { Box } from "@material-ui/core";
import React from "react";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";

const Attachments: React.FunctionComponent<{}> = () => {
  return (
    <Box mt={1}>
      <HeaderField dataProp="common.attachments" variant="regular" />
      <AttachmentField name="attachments" component="field" />
      <AttachmentIconField name="attachments" />
    </Box>
  );
};

export default Attachments;
