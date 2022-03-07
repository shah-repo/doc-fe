import { Box, Chip, createStyles, ListItem, makeStyles, Tooltip, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { DataProps } from "../../../state/ducks/common/types";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import { ReferenceSummary as Model } from "../utils/types";

interface OwnProps {
  label: string;
}

type Props = OwnProps & DataProps<Model[]>;

const styles = makeStyles((theme) =>
  createStyles({
    chip: {
      "border": `1px solid ${Colors.medium_blue}`,
      "borderRadius": "3px",
      "background": Colors.light_blue,
      "&:hover": {
        cursor: "pointer",
      },
    },
    link: {
      textDecoration: "none",
    },
    header: {
      fontSize: "12px",
      color: Colors.almost_black,
      fontFamily: "Sora",
    },
    noHeader: {
      fontSize: "14px",
      color: Colors.almost_black,
      fontFamily: "Sora",
    },
    marginBottom12: {
      marginBottom: "16px",
    },
    marginBottom6: {
      marginBottom: "6px",
    },
  }));

const ReferencePresenter: React.FunctionComponent<Props> = ({
  dataProp,
  label,
}) => {
  const classes = styles();
  const referencesRenderer = () =>
    dataProp.map((reference: Model, index) => (
      <Box component="span" key={reference.id} data-cy={label}>
        <Tooltip title={reference.title} id="ChangeRequestLink-tootlip" >
          <Link className={classes.link} to={reference.url} target="_blank" id="ReferencePresenter-link">
            <Chip
              className={classes.chip}
              label={`${reference.docId} - ${reference.displayRevision} - ${reference.title}`}
            />
          </Link>
        </Tooltip>
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
