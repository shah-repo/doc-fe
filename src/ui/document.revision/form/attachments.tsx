import { Box } from "@material-ui/core";
import React from "react";
import AttachmentField from "../../components/common/attachment.field/container";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";

interface Props {
  isDisabled: boolean;
  isNewVersion: boolean;
}

const Attachments: React.FunctionComponent<Props> = ({ isDisabled = false, isNewVersion }) => (
  <Box marginBottom="33px">
    <HeaderField
      dataProp="common.attachments"
    />
    <AttachmentField name="attachments" component="field" disabled={isDisabled}/>
    {<AttachmentIconField name="attachments" isNewVersion={isNewVersion} />}
  </Box>
);

export default React.memo(Attachments);
