import { Box, createStyles, IconButton, ListItem, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { HighlightOffOutlined } from "@material-ui/icons";
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
  handleRemoveBuild?: (id: string) => void;
  docRevId?: string;
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
      marginRight: "8px",
    },
  }));

export const BuildsPresenter: React.FunctionComponent<Props> = ({
  dataProp,
  label,
  isDraft,
  docRevId,
  handleRemoveBuild,
}) => {
  const classes = styles();

  const referencesRenderer = () =>
    dataProp.map((docRev: any, index) => (
      <Box component="span" key={`${docRev.id}-${index}`}
        width="max-content"
        px={1}
        py={0.5}
        mr={2}
        mb={2}
        display="flex"
        flexDirection="row"
        alignItems="center"
        borderRadius={4}
        border={1}
        borderColor={Colors.medium_blue}
        bgcolor={Colors.light_blue}
      >
        <Link
          className={classes.link}
          to={documentVersionPath(docRev.id, docRev.document?.id )}
          target="_blank"
          data-cy={`BuildsPresenter-link-${label}`}
        >
          <Tooltip title={docRev.name} data-cy="BuildsLink-tootlip" >
            <Typography
              id="BuildsPresenter-buildtext"
              variant="caption"
              color="primary"
              noWrap={true}
            >
              {`${docRev.document?.docId} - ${stripTags(docRev.name)}`}
            </Typography>
          </Tooltip>
        </Link>
        {docRevId && handleRemoveBuild &&
        <Tooltip id="tooltip-removeBuild" title={<Text translation="common.remove" />}>
          <IconButton
            id="removeBuild"
            aria-label="removeBuild"
            onClick={() => handleRemoveBuild(docRev.id)}
            style={{ padding: 0 }}
          >
            <HighlightOffOutlined fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
        }
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
      <Box display="flex" ml={isDraft ? 0 : 2}>
        {referencesRenderer()}
      </Box>
      {!dataProp.length && buildsEmptyRenderer()}
    </Box>
  );
};

export default BuildsPresenter;
