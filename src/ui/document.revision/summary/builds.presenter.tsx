import { Box, Chip, createStyles, ListItem, makeStyles, Tooltip, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { stripTags } from "../../../common/utils/helpers";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import { documentVersionPath } from "../utils/paths";

interface OwnProps {
  label: string;
  isDraft?: boolean;
}

export type Props = OwnProps & DataProps<DocumentRevision[]>;

export const styles = makeStyles((theme) =>
  createStyles({
    chip: {
      "border": `1px solid ${Colors.medium_blue}`,
      "borderRadius": "3px",
      "background": Colors.light_blue,
      "&:hover": {
        cursor: "pointer",
      },
      "marginTop": theme.spacing(2),
    },
    link: {
      textDecoration: "none",
    },
  }));

export const BuildsPresenter: React.FunctionComponent<Props> = ({
  dataProp,
  label,
  isDraft,
}) => {
  const classes = styles();

  const referencesRenderer = () =>
    dataProp.map((docRev: DocumentRevision, index) => (
      <Box ml={isDraft ? 0 : 2} component="span" key={docRev.id}>
        <Tooltip title={docRev.name} data-cy="BuildsLink-tootlip" >
          <Link
            className={classes.link}
            // temp - TODO - uncomment the following line and delete the one below when BE adds document ID
            // to={documentVersionPath(docRev.id, docRev.document.id )}
            to={documentVersionPath(docRev.id, docRev.document?.id || "abcde-fghij-klmno")}
            target="_blank"
            data-cy="BuildsPresenter-link"
          >
            <Chip
              className={classes.chip}
              label={`${docRev.document?.docId} - ${stripTags(docRev.name)}`}
            />
          </Link>
        </Tooltip>
      </Box>
    ));

  const buildsEmptyRenderer = () => (
    <Box ml={isDraft ? 0 : 2}>
      <Typography variant="h5" >
        <Text message="common.none"/>
      </Typography>
    </Box>
  );
  return (
    <Box pb={3}>
      <ListItem data-cy="BuildsPresenter-label"
        style={{ paddingLeft: isDraft ? 0 : 16 }}>
        <Typography variant="h6">
          <Text message={label} />
        </Typography>
      </ListItem>
      {referencesRenderer()}
      {!dataProp.length && buildsEmptyRenderer()}
    </Box>
  );
};

export default BuildsPresenter;
