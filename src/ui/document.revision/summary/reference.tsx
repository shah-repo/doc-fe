import { Box, ListItem, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { DataProps } from "../../../state/ducks/common";
import { Reference as Model } from "../../../state/ducks/documentRevisions";
import SummaryField from "../../common/summary/base";
import Text from "../../components/Text";
import styles from "./styles";

type Props = DataProps<Model[]> & WithStyles<typeof styles>;

const Reference: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
}) => {

  const referencesRenderer = () => dataProp.map((reference, index) =>
    <SummaryField key={index} label={`${index + 1}`} value={reference.name} />);

  return (
    <Box className={classes.box}>
      <ListItem>
        <Typography variant="h6"><Text translation="common.referenced.by" />:</Typography>
      </ListItem>
      {referencesRenderer()}
    </Box>
  );
};

export default withStyles(styles)(Reference);
