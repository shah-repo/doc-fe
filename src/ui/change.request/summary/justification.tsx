import {
  Box,
  Grid,
  ListItem,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { JustificationProps } from "../../../state/ducks/changeRequest";
import BaseSummaryField from "../../common/summary/base";
import FileCard from "../../components/cards/FileCard";
import Text from "../../components/Text";
import styles from "./styles";

type Props = JustificationProps & WithStyles<typeof styles>;

const Justification: React.FunctionComponent<Props> = ({
  classes,
  justification,
}) => {

  const { description, attachments } = justification;

  const attachmentRenderer = () => attachments.map((attachment, index) => (
    <FileCard key={index} attachment={attachment} />
  ));

  return (
    <Box className={classes.box}>
      <ListItem>
        <Typography variant="h6"><Text translation="common.justifications" />:</Typography>
      </ListItem>
      <BaseSummaryField label="common.description" value={description} />;
      {attachments && <ListItem><Grid container={true} spacing={1}>{attachmentRenderer()}</Grid></ListItem>}
    </Box>
  );
};

export default withStyles(styles)(Justification);
