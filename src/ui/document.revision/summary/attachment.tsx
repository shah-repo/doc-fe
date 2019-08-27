import { Box, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import AttachmentField from "../../components/common/attachment.icon/container";
import HeaderField from "../../components/common/header.field/field";
import styles from "./styles";

type Props = WithStyles<typeof styles>;

const Attachment: React.FunctionComponent<Props> = ({
  classes,
}) => {

  return (
    <Box className={classes.box}>
      <HeaderField dataProp="common.attachments" />
      <AttachmentField name="attachments" />
    </Box>
  );
};

export default withStyles(styles)(Attachment);
