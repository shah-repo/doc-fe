import { Box, Chip, createStyles, ListItem, makeStyles, Tooltip, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { DataProps } from "../../../state/ducks/common";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import { ReferenceSummary as Model } from "../utils/types";

interface OwnProps {
  label: string;
}

export type Props = OwnProps & DataProps<Model[]>;

export const styles = makeStyles((theme) =>
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
  }));

export const ReferencePresenter: React.FunctionComponent<Props> = ({
  dataProp,
  label,
}) => {
  const classes = styles();
  const referencesRenderer = () =>
    dataProp.map((reference: Model, index) => (
      <Box marginLeft={2} component="span" key={reference.id} data-cy={label}>
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
    <Box marginLeft={2}>
      <Typography variant="h5" >
        <Text message="common.none"/>
      </Typography>
    </Box>
  );
  return (
    <Box pb={3}>
      <ListItem id="ReferencePresenter-label">
        <Typography variant="h6">
          <Text message={label} />
        </Typography>
      </ListItem>
      {referencesRenderer()}
      {!dataProp.length && referencesEmptyRenderer()}
    </Box>
  );
};

export default ReferencePresenter;
