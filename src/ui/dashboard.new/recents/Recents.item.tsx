import {
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  withStyles,
} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import React from "react";
import { ReactComponent as CollapseIcon } from "../../../assets/images/collapse.svg";
import { ReactComponent as ExpandIcon } from "../../../assets/images/expand.svg";
import { ReactComponent as FMIcon } from "../../../assets/images/FM.svg";
import { ReactComponent as MPIIcon } from "../../../assets/images/MPI.svg";
import { ReactComponent as ApprovalIcon } from "../../../assets/images/pending_approval.svg";
import { ReactComponent as POIcon } from "../../../assets/images/PO.svg";
import { ReactComponent as SOPIcon } from "../../../assets/images/SOP.svg";
import { RecentGroupType } from "../../../state/ducks/dashboard.new/types";
import { changeRequestEditPath } from "../../../ui/change.request/utils/paths";
import { documentVersionPath } from "../../../ui/document.revision/utils/paths";
import Colors from "../../layout/theme/utils/colors";
import { styles } from "./Recents.item.styles";

interface Props {
  index: number;
  id: string;
  docId: string;
  revisionId?: string | undefined;
  type: string;
  title: string;
  description?: string;
  accessedAt: string;
  details?: any; // TO DO:: type definition needs to be added
}

const RecentsLineItem: React.FunctionComponent<Props> = ({
  id,
  docId,
  revisionId,
  type,
  title,
  description,
  accessedAt,
  details,
}) => {
  const classes = styles();
  // TO DO: Needs to remove below line once we get icons for all the possible line item types
  const itemTypes = [RecentGroupType.PO, "MPI", "FORM", "SUPPLIER", "CHANGE_REQUEST", "DAM"];
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const StyledListItem = withStyles({
    root: {
      "&:hover": {
        backgroundColor: Colors.sky_blue,
      },
    },
  })(ListItem);

  return (
    <>
      <StyledListItem
        style={open ? { backgroundColor: Colors.sky_blue } : {}}
        button
        className={type === RecentGroupType.PO ? classes.listItem : ""}
      >
        {type === RecentGroupType.PO &&
          (open ? (
            <CollapseIcon className={classes.icon} onClick={handleClick}/>
          ) : (
            <ExpandIcon className={classes.icon} onClick={handleClick}/>
          ))}
        <ListItemIcon>
          <>
            {type === RecentGroupType.PO && <POIcon />}
            {type === RecentGroupType.MPI && <MPIIcon />}
            {type === RecentGroupType.FORM && <FMIcon />}
            {(type === RecentGroupType.CHANGE_REQUEST || type === RecentGroupType.DAM) && <ApprovalIcon />}
            {(type === RecentGroupType.SUPPLIER || !itemTypes.includes(type)) && <SOPIcon />}
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
                {type === RecentGroupType.CHANGE_REQUEST && (
                  <Link
                    href={changeRequestEditPath(id)}
                    color="inherit"
                    className= {classes.link}
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
                {type !== RecentGroupType.CHANGE_REQUEST && (
                  <Link
                    href={documentVersionPath(revisionId as string, id)}
                    color="inherit"
                    className= {classes.link}
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
              {type === RecentGroupType.PO && (
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
                {type === RecentGroupType.CHANGE_REQUEST && (
                  <Link
                    href={changeRequestEditPath(id)}
                    color="inherit"
                    className= {classes.link}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      className={classes.typographyBold}
                      color="textSecondary"
                      noWrap
                    >
                      {title}
                    </Typography>
                  </Link>
                )}
                {type !== RecentGroupType.CHANGE_REQUEST && (
                  <Link
                    href={documentVersionPath(revisionId as string, id)}
                    color="inherit"
                    className= {classes.link}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      className={classes.typographyBold}
                      color="textSecondary"
                      noWrap
                    >
                      {title}
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
      {type === RecentGroupType.PO && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding className={classes.collapsedList}>
            <StyledListItem button className={classes.nested} disableRipple>
              <Grid container className={classes.gridContainer}>
                <Grid item md={3} sm={6}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyChildrenBold}
                    color="textSecondary"
                  >
                    Supplier:
                  </Typography>
                </Grid>
                <Grid item md={9} sm={6}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.linkText}
                    color="textPrimary"
                  >
                    {details.supplier || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </StyledListItem>
            <StyledListItem button className={classes.nested} disableRipple>
              <Grid container className={classes.gridContainer}>
                <Grid item md={3} sm={6}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyChildrenBold}
                    color="textSecondary"
                  >
                    Total:
                  </Typography>
                </Grid>
                <Grid item md={9} sm={6}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                  >
                    {details.po_amount || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </StyledListItem>
            <StyledListItem button className={classes.nested} disableRipple>
              <Grid container className={classes.gridContainer}>
                <Grid item md={3} sm={6}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyChildrenBold}
                    color="textSecondary"
                  >
                    Description:
                  </Typography>
                </Grid>
                <Grid item md={9} sm={6}>
                  <span
                    className={classes.typography}
                    dangerouslySetInnerHTML={{
                      __html: (description as string) || "N/A",
                    }}
                  />
                </Grid>
              </Grid>
            </StyledListItem>
            <StyledListItem button className={classes.nested} disableRipple>
              <Grid container className={classes.gridContainer}>
                <Grid item md={3} sm={6}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyChildrenBold}
                    color="textSecondary"
                  >
                    Line Items:
                  </Typography>
                </Grid>
                <Grid item md={9} sm={6}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                  >
                    {details.po_lineItems || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </StyledListItem>
            <StyledListItem button className={classes.nested} disableRipple>
              <Grid container className={classes.gridContainer}>
                <Grid item md={3} sm={6}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyChildrenBold}
                    color="textSecondary"
                  >
                    Attachments:
                  </Typography>
                </Grid>
                <Grid item md={9} sm={6}>
                  <Grid container justify="space-between" alignContent="center">
                    {(details.po_attachments &&
                      details.po_attachments.map((attachmentInfo, index) => (
                        <Grid item key={index}>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.linkText}
                            color="textPrimary"
                          >
                            {attachmentInfo.name}
                          </Typography>
                        </Grid>
                      ))) ||
                      "N/A"}
                  </Grid>
                </Grid>
              </Grid>
            </StyledListItem>
          </List>
        </Collapse>
      )}
    </>
  );
};

export default RecentsLineItem;
