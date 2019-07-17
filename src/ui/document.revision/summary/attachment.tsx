import { Box, Grid, ListItem, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Attachment as Model } from "../../../state/ducks/attachments";
import { DataProps } from "../../../state/ducks/common";
import FileCard from "../../components/cards/FileCard";
import Text from "../../components/Text";
import styles from "./styles";

type Props = DataProps<Model[]> & WithStyles<typeof styles>;

const Attachment: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
}) => {

  const attachmentRenderer = () => dataProp.map((attachment, index) => (
    <FileCard key={index} attachment={attachment} />
  ));

  return (
    <Box className={classes.box}>
      <ListItem>
        <Typography variant="h6"><Text translation="common.attachments" />:</Typography>
      </ListItem>
      <ListItem>
        <Grid container={true} spacing={2}>{attachmentRenderer()}</Grid>
      </ListItem>
    </Box>
  );
};

export default withStyles(styles)(Attachment);
