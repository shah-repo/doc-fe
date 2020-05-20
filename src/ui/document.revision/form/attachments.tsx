import { Box } from "@material-ui/core";
import React from "react";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";

interface Props {
  isDisabled: boolean;
}

const Attachments: React.FunctionComponent<Props> = ({ isDisabled = false }) => (
  <Box marginBottom="33px">
    <HeaderField
      dataProp="common.attachments"
      variant="regular"
      color="secondary"
    />
    <AttachmentField name="attachments" component="field" disabled={isDisabled}/>
    {!isDisabled && <AttachmentIconField name="attachments" />}
  </Box>
);

export default React.memo(Attachments);
