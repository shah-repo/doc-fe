import {
  Box,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Justifications } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import AttachmentIconField from "../../components/common/attachment.icon/container";
import Text from "../../components/Text";

export type Props = DataProps<Justifications>;

export const Justification: React.FunctionComponent<Props> = ({
  dataProp,
}) => {
  const { description, attachments } = dataProp;
  const hasAttachment = (attachments || []).length > 0;

  const reasoningRenderer = () => (
    <Box>
      <SummaryFieldWithHtml label="common.justifications" value={description} />
    </Box>
  );

  const attachmentRenderer = () => (
    <Box>
      <Typography variant="h6">
        <Text translation="common.justifications" />
      </Typography>
      <AttachmentIconField
        name="justifications.attachments"
        disabled={true}
      />
    </Box>
  );

  return (
    <Box ml={2} mb={3}>
      {description && reasoningRenderer()}
      {hasAttachment && attachmentRenderer()}
    </Box>
  );
};

export default Justification;
