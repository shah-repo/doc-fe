import { Box, Chip, createStyles, ListItem, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { isArray } from "lodash";
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

export type Props = OwnProps & DataProps<DocumentRevision | DocumentRevision[]>;

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
  const renderBuild = (id, name, documentId, docId, description) => (
    <Box ml={isDraft ? 0 : 2} component="span" key={id}>
      <Tooltip title={name} id="BuildsLink-tootlip" >
        <Link
          className={classes.link}
          to={documentVersionPath(id, documentId)}
          target="_blank"
          id="BuildsPresenter-link"
        >
          <Chip
            className={classes.chip}
            label={`${docId} - ${stripTags(description)}`}
          />
        </Link>
      </Tooltip>
    </Box>
  );

  const buildsEmptyRenderer = () => (
    <Box ml={isDraft ? 0 : 2}>
      <Typography variant="h5" >
        <Text message="common.none"/>
      </Typography>
    </Box>
  );
  return (
    <Box pb={3}>
      <ListItem id="BuildsPresenter-label"
        style={{ paddingLeft: isDraft ? 0 : 16 }}>
        <Typography variant="h6">
          <Text message={label} />
        </Typography>
      </ListItem>
      {!isArray(dataProp) &&
        renderBuild(dataProp.id, dataProp.name, dataProp.document.id, dataProp.document.docId, dataProp.description)}
      {isArray(dataProp) && dataProp.map((docRev: DocumentRevision, index) => (
        renderBuild(docRev.id, docRev.name, docRev.document.id, docRev.document.docId, docRev.description)
      ))}
      {isArray(dataProp) && (!dataProp.length || !dataProp) && buildsEmptyRenderer()}
    </Box>
  );
};

export default BuildsPresenter;
