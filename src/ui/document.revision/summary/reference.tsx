import { Box, ListItem, Typography, WithStyles, withStyles, Grid } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { DataProps } from "../../../state/ducks/common";
import { Reference as Model } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import styles from "./styles";
import { documentVersionPath, documentDetailsPath } from "../utils/paths";
import { Translation } from "../../translations/types";

interface OwnProps {
  label: Translation;
  isReferenceTo: boolean;
}

type Props = OwnProps & DataProps<Model[]> & WithStyles<typeof styles>;

const Reference: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  label,
  isReferenceTo,
}) => {

  const referencesRenderer = () => dataProp.map((reference: any, index) => {
    const url = isReferenceTo
      ? documentDetailsPath(reference.id)
      : documentVersionPath(reference.id, reference.document.id);
    
    return (
      <ListItem key={reference.id}>
        <Grid item={true} xs={4}>
          <Typography variant="body1"><Text message={`${index + 1}`} />:</Typography>
        </Grid>
        <Grid item={true} xs={8}>
          <Typography variant="subtitle1">
            <Link
              to={url}
              target="_blank"
            >
              {reference.name}
            </Link>
          </Typography>
        </Grid>
      </ListItem>
    )
  });

  return (
    <Box className={classes.box}>
      <ListItem>
        <Typography variant="h6"><Text translation={label} />:</Typography>
      </ListItem>
      {referencesRenderer()}
    </Box>
  );
};

export default withStyles(styles)(Reference);
