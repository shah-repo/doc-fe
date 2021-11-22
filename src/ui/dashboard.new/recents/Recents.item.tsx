import {
  Box,
  Grid,
  Link,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as FMIcon } from "../../../assets/images/FM.svg";
import { ReactComponent as MPIIcon } from "../../../assets/images/MPI.svg";
import { ReactComponent as ApprovalIcon } from "../../../assets/images/pending_approval.svg";
import { ReactComponent as POIcon } from "../../../assets/images/PO.svg";
import { ReactComponent as SOPIcon } from "../../../assets/images/SOP.svg";
import {
  RecentDocTypeGroups,
  RecentItems,
} from "../../../state/ducks/dashboard.new/recents/types";
import { changeRequestEditPath } from "../../../ui/change.request/utils/paths";
import { documentVersionPath } from "../../../ui/document.revision/utils/paths";
import { styles } from "./Recents.item.styles";
import { StyledListItem } from "./StyledListItem";

const RecentsLineItem: React.FunctionComponent<RecentItems> = ({
  itemId,
  docId,
  docRevId,
  itemType,
  docTypeGroup,
  docTitle,
  accessedAt,
}) => {
  const classes = styles();
  const getIcon = (docTypeGroup: RecentDocTypeGroups) => {
    switch (docTypeGroup) {
      case RecentDocTypeGroups.CHANGE_REQUEST:
        return <ApprovalIcon />;
      case RecentDocTypeGroups.PO:
        return <POIcon />;
      case RecentDocTypeGroups.PI:
        return <MPIIcon />;
      case RecentDocTypeGroups.FORM:
        return <FMIcon />;
      case RecentDocTypeGroups.SUPPLIER:
        return <SOPIcon />;
      default:
        return <SOPIcon />;
    }
  };
  return (
    <StyledListItem button>
      <ListItemIcon>
        <>{getIcon(docTypeGroup)}</>
      </ListItemIcon>
      <ListItemText
        primary={
          <Grid
            container={true}
            wrap="nowrap"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item={true}>
              {docTypeGroup === RecentDocTypeGroups.CHANGE_REQUEST && (
                <Link
                  href={changeRequestEditPath(itemId)}
                  color="inherit"
                  className={classes.link}
                >
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    {docId}
                  </Typography>
                </Link>
              )}
              {docTypeGroup !== RecentDocTypeGroups.CHANGE_REQUEST && (
                <Link
                  href={documentVersionPath(docRevId || "", itemId)}
                  color="inherit"
                  className={classes.link}
                >
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    {docId}
                  </Typography>
                </Link>
              )}
            </Grid>
            <Grid zeroMinWidth item={true} className={classes.truncateText}>
              {docTypeGroup === RecentDocTypeGroups.CHANGE_REQUEST && (
                <Link
                  href={changeRequestEditPath(itemId)}
                  color="inherit"
                  className={classes.link}
                >
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                    noWrap
                  >
                    {docTitle}
                  </Typography>
                </Link>
              )}
              {docTypeGroup !== RecentDocTypeGroups.CHANGE_REQUEST && (
                <Link
                  href={documentVersionPath(docRevId || "", itemId)}
                  color="inherit"
                  className={classes.link}
                >
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                    noWrap
                  >
                    {docTitle}
                  </Typography>
                </Link>
              )}
            </Grid>
            <Grid
              item={true}
              className={`${classes.ml5}`}
            >
              <Box
                className={`${classes.blackDot}`}>
              </Box>
            </Grid>
            <Grid item={true}>
              <Typography
                component="span"
                variant="caption"
                className={`${classes.timestampContainer} ${classes.ml5}`}
                color="textSecondary"
                noWrap
              >
                {accessedAt}
              </Typography>
            </Grid>
          </Grid>
        }
      />
    </StyledListItem>
  );
};

export default RecentsLineItem;
