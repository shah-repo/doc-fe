import { Box } from "@material-ui/core";
import React from "react";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";

const Attachments: React.FunctionComponent<{}> = () => (
  <Box marginBottom="33px">
    <HeaderField
      dataProp="common.attachments"
      variant="regular"
      color="secondary"
    />
    <AttachmentField name="attachments" component="field" />
    <AttachmentIconField name="attachments" />
  </Box>
);

export default Attachments;
