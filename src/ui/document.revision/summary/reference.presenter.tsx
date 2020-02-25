import { Box, Grid, ListItem, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { DataProps } from "../../../state/ducks/common";
import Text from "../../components/Text";
import { ReferenceSummary as Model } from "../utils/types";
import styles from "./styles";

interface OwnProps {
  label: string;
}

export type Props = OwnProps & DataProps<Model[]> & WithStyles<typeof styles>;

export const ReferencePresenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  label,
}) => {
  const referencesRenderer = () =>
    dataProp.map((reference: Model, index) => {
      return (
        <Grid item key={reference.id}>
          <ListItem>
            <Grid item={true} xs={12}>
              <Typography variant="body1">
                <Text message={`${index + 1}`} />.{" "}
                <Link to={reference.url} target="_blank" id="ReferencePresenter-link">
                  {reference.title}
                </Link>
              </Typography>
            </Grid>
          </ListItem>
        </Grid>
      );
    });

  return (
    <Box className={classes.box}>
      <ListItem id="ReferencePresenter-label">
        <Typography variant="h6">
          <Text message={label} />
        </Typography>
      </ListItem>
      {referencesRenderer()}
    </Box>
  );
};

export default withStyles(styles)(ReferencePresenter);
