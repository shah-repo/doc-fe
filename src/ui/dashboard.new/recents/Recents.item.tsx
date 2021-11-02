import {
  Grid,
  Link,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as FMIcon } from "../../../assets/images/FM.svg";
import { ReactComponent as ApprovalIcon } from "../../../assets/images/pending_approval.svg";
import { ReactComponent as POIcon } from "../../../assets/images/PO.svg";
import { ReactComponent as SOPIcon } from "../../../assets/images/SOP.svg";
import {
  RecentDocGroups,
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
  docType,
  docTitle,
  accessedAt,
}) => {
  const classes = styles();
  const getIcon = (docType: RecentDocGroups) => {
    switch (docType) {
      case RecentDocGroups.APPROVAL_REQUEST:
        return <ApprovalIcon />;
      case RecentDocGroups.PURCHASE_ORDER:
        return <POIcon />;
      case RecentDocGroups.FORM:
        return <FMIcon />;
      case RecentDocGroups.SUPPLIERS:
        return <SOPIcon />;
      default:
        return <SOPIcon />;
    }
  };
  return (
    <StyledListItem button>
      <ListItemIcon>
        <>{getIcon(docType)}</>
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
              {docType === RecentDocGroups.APPROVAL_REQUEST && (
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
              {docType !== RecentDocGroups.APPROVAL_REQUEST && (
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
            &nbsp;
            {docType === RecentDocGroups.PURCHASE_ORDER && docTitle && (
              <Grid item={true}>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typography}
                  color="textPrimary"
                  noWrap
                >
                  to&nbsp;
                </Typography>
              </Grid>
            )}
            <Grid zeroMinWidth item={true} className={classes.truncateText}>
              {docType === RecentDocGroups.APPROVAL_REQUEST && (
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
              {docType !== RecentDocGroups.APPROVAL_REQUEST && (
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
            &nbsp;&nbsp;
            <Grid item={true} className={classes.blackDot}>
              &nbsp;
            </Grid>
            <Grid item={true}>
              <Typography
                component="span"
                variant="caption"
                className={classes.timestampContainer}
                color="textSecondary"
              >
                &nbsp;{accessedAt}
              </Typography>
            </Grid>
          </Grid>
        }
      />
    </StyledListItem>
  );
};

export default RecentsLineItem;
