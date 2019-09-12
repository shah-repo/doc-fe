import {
  Box,
  Grid,
  ListItem,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import AttachmentField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import styles from "./styles";

type Props = WithStyles<typeof styles>;

const Attachment: React.FunctionComponent<Props> = ({ classes }) => {
  return (
    <Box p={2}>
      <HeaderField dataProp="common.attachments" color="primary" />
      <AttachmentField name="attachments" disabled={true} />
    </Box>
  );
};

export default withStyles(styles)(Attachment);
