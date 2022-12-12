import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { DataProps } from "../../../state/ducks/common/types";
import Text from "../../components/Text";
import { ReferenceSummary as Model } from "../utils/types";
import { styles } from "./references.styles";

interface OwnProps {
  label: string;
  fromReferencedBy?: boolean;
  canEdit?: boolean;
}

type Props = OwnProps & DataProps<Model[]>;

const ReferencePresenter: React.FunctionComponent<Props> = ({
  dataProp,
  label,
  fromReferencedBy,
  canEdit,
}) => {
  const classes = styles();
  const referencesRenderer = () =>
    dataProp.map((reference: Model, index) => (
      <Box component="span" key={reference.id} data-cy={label}>
        <Grid
          key={index}
          justify="space-between"
          alignItems="center"
          container
          className={classes.selectedUsersGrid}
        >
          <Grid item className={classes.avatarSection}>
            <Typography
              component="span"
              variant="body2"
              color="textPrimary"
            >
              {
                <Link
                  className={classes.link}
                  to={reference.url}
                  target="_blank"
                  id="ReferencePresenter-link"
                >
                  {`${reference.docId} - ${reference.displayRevision} - ${reference.title}`}
                </Link>
              }
            </Typography>
          </Grid>
        </Grid>
      </Box>
    ));

  const referencesEmptyRenderer = () => (
    <>
      <Typography variant="h5" className={classes.noHeader} >
        <Text message="common.none"/>
      </Typography>
    </>
  );
  return (
    <Box mb={2.5}>
      <Box display={!canEdit && !fromReferencedBy ? "block" : "none"}>
        <Typography variant="h6" className={classes.header}>
          <Text message={label} />
        </Typography>
      </Box>
      {fromReferencedBy && <>
        <Typography variant="h6" className={classes.header}>
          <Text message={label} />
        </Typography>
      </>}
      {referencesRenderer()}
      {!dataProp.length && !canEdit && !fromReferencedBy && referencesEmptyRenderer()}
      {!dataProp.length && fromReferencedBy && referencesEmptyRenderer()}
    </Box>
  );
};

export default ReferencePresenter;
