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
  RecentDocType,
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
  // TO DO: Needs to remove below line once we get icons for all the possible line item types
  const itemTypes = [
    RecentDocType.APPROVAL_REQUEST,
    RecentDocType.PURCHASE_ORDER,
    RecentDocType.FORM,
    RecentDocType.SUPPLIERS,
  ];

  return (
    <StyledListItem button>
      <ListItemIcon>
        <>
          {docType === RecentDocType.APPROVAL_REQUEST && <ApprovalIcon />}
          {docType === RecentDocType.PURCHASE_ORDER && <POIcon />}
          {docType === RecentDocType.FORM && <FMIcon />}
          {(docType === RecentDocType.SUPPLIERS ||
            !itemTypes.includes(docType)) && <SOPIcon />}
        </>
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
              {docType === RecentDocType.APPROVAL_REQUEST && (
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
                    {docId}&nbsp;
                  </Typography>
                </Link>
              )}
              {docType !== RecentDocType.APPROVAL_REQUEST && (
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
                    {docId}&nbsp;
                  </Typography>
                </Link>
              )}
            </Grid>
            {docType === RecentDocType.PURCHASE_ORDER && docTitle && (
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
              {docType === RecentDocType.APPROVAL_REQUEST && (
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
              {docType !== RecentDocType.APPROVAL_REQUEST && (
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
              &nbsp;&nbsp;
            </Grid>
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
