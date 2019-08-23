import { Box, ListItem, Typography, WithStyles, withStyles, Grid } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { DataProps } from "../../../state/ducks/common";
import { Reference as Model, DocumentRevisionStatus } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import styles from "./styles";

interface OwnProps {
  label: string;
  getUrl: (reference: any) => string;
  docId: (reference: any) => string;
  docTitle: (reference: any) => string;
}

type Props = OwnProps & DataProps<Model[]> & WithStyles<typeof styles>;

const ReferencePresenter: React.FunctionComponent<Props> = ({
  classes,
  dataProp,
  label,
  getUrl,
  docId,
  docTitle,
}) => {
  const referencesRenderer = () => dataProp.map((reference: any, index) => {
    const notDeprecated = reference.status !== DocumentRevisionStatus.Deprecated;
    return (
      <React.Fragment key={reference.id}>
        { notDeprecated &&
          (
            <ListItem>
              <Grid item={true} xs={4}>
                <Typography variant="body1"><Text message={`${index + 1}`} />:</Typography>
              </Grid>
              <Grid item={true} xs={8}>
                <Typography variant="subtitle1">
                  <Link
                    to={getUrl(reference)}
                    target="_blank"
                  >
                    {docId(reference)} - {docTitle(reference)}
                  </Link>
                    </Typography>
              </Grid>
            </ListItem>
          )}
      </React.Fragment>
    );
  });

  return (
    <Box className={classes.box}>
      <ListItem>
        <Typography variant="h6"><Text message={label} />:</Typography>
      </ListItem>
      {referencesRenderer()}
    </Box>
  );
};

export default withStyles(styles)(ReferencePresenter);
