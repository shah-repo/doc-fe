import { Box, Grid, ListItem, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../../../assets/images/delete_icon.svg";
import { DataProps } from "../../../state/ducks/common/types";
import Text from "../../components/Text";
import { ReferenceSummary as Model } from "../utils/types";
import { styles } from "./references.styles";

interface OwnProps {
  label: string;
  fromReferencedBy?: boolean;
}

type Props = OwnProps & DataProps<Model[]>;

const ReferencePresenter: React.FunctionComponent<Props> = ({
  dataProp,
  label,
  fromReferencedBy,
}) => {
  const classes = styles();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleDelete = () => {};
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
          {!fromReferencedBy && <Grid item className={classes.deleteIcon}>
            <DeleteIcon onClick={() => handleDelete()} />
          </Grid>}
        </Grid>
      </Box>
    ));

  const referencesEmptyRenderer = () => (
    <Box>
      <Typography variant="h5" className={classes.noHeader} >
        <Text message="common.none"/>
      </Typography>
    </Box>
  );
  return (
    <Box className={classes.marginBottom12}>
      <ListItem id="ReferencePresenter-label" disableGutters dense className={classes.marginBottom6}>
        <Typography variant="h6" className={classes.header}>
          <Text message={label} />
        </Typography>
      </ListItem>
      {referencesRenderer()}
      {!dataProp.length && referencesEmptyRenderer()}
    </Box>
  );
};

export default ReferencePresenter;
