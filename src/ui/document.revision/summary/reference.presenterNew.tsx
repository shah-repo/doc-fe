import {
  Box,
  ListItem,
  Typography,
  WithStyles,
  withStyles,
  Grid,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { DataProps } from "../../../state/ducks/common";
import {
  ReferenceSummary as Model,
} from "../utils/types";
import Text from "../../components/Text";
import styles from "./styles";

interface OwnProps {
  label: string;
}

type Props = OwnProps & DataProps<Model[]> & WithStyles<typeof styles>;

const ReferencePresenterNew: React.FunctionComponent<Props> = ({
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
                <Text message={`${index + 1}`} />:
                <Link to={reference.url} target="_blank">
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
      <ListItem>
        <Typography variant="h6">
          <Text message={label} />:
        </Typography>
      </ListItem>
      {referencesRenderer()}
    </Box>
  );
};

export default withStyles(styles)(ReferencePresenterNew);
