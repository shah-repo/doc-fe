import {
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
  RecentDocType,
  RecentItems,
} from "../../../state/ducks/dashboard.new/types";
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
    RecentDocType.PO,
    RecentDocType.MPI,
    RecentDocType.FORM,
    RecentDocType.SUPPLIER,
    RecentDocType.DAM,
    RecentDocType.CHANGE_REQUEST,
    RecentDocType.APPROVAL_REQUEST,
    RecentDocType.PURCHASE_ORDER,
  ];

  return (
    <StyledListItem button>
      <ListItemIcon>
        <>
          {(docType === RecentDocType.PO ||
            docType === RecentDocType.PURCHASE_ORDER) && <POIcon />}
          {docType === RecentDocType.MPI && <MPIIcon />}
          {docType === RecentDocType.FORM && <FMIcon />}
          {(docType === RecentDocType.CHANGE_REQUEST ||
            docType === RecentDocType.APPROVAL_REQUEST ||
            docType === RecentDocType.DAM) && <ApprovalIcon />}
          {(docType === RecentDocType.SUPPLIER ||
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
              {(docType === RecentDocType.CHANGE_REQUEST ||
                docType === RecentDocType.APPROVAL_REQUEST) && (
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
              {![
                RecentDocType.CHANGE_REQUEST,
                RecentDocType.APPROVAL_REQUEST,
              ].includes(docType) && (
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
            {(docType === RecentDocType.PO ||
              docType === RecentDocType.PURCHASE_ORDER) && (
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
              {(docType === RecentDocType.CHANGE_REQUEST ||
                docType === RecentDocType.APPROVAL_REQUEST) && (
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
              {![
                RecentDocType.CHANGE_REQUEST,
                RecentDocType.APPROVAL_REQUEST,
              ].includes(docType) && (
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
