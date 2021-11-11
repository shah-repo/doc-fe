/* eslint-disable react-hooks/rules-of-hooks */
import {
  Avatar,
  Grid,
  Link,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as RejectSolidIcon } from "../../../../../assets/images/reject_status.svg";
// import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
// import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as RejectIcon } from "../../../../../assets/images/reject_status_solid.svg";
import { STATUS_TYPES_LABEL } from "../../../../../state/ducks/dashboard.new/my.feeds/types";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import { HoverStyleChip } from "../../common/HoverStyleChipApprovalRejected";
import { NormalStyleChip } from "../../common/NormalStyleChipApprovalRejected";
import { StyledListItem } from "../../common/StyledListItem";
// import { StyleTooltip } from "../../common/StyleTooltip";
import { styles } from "./rejected.styles";

interface Props {
  id: string;
  docDocumentId: string;
  type: string;
  docRevName: string;
  docId?: string | undefined;
  docRevId?: string | undefined;
  status: STATUS_TYPES_LABEL;
  timestamp: string | undefined;
  docRevOwnerAvatar?: string | undefined | null;
  docRevOwnerName: string | undefined;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
}
const taskApprovalPresenter: React.FunctionComponent<Props> = ({
  id,
  docDocumentId,
  docId,
  docRevId,
  docRevName,
  docRevOwnerName,
  timestamp,
  status,
  docRevOwnerAvatar,
  hoverItemId,
  onMouseHoverItem,
}) => {
  const classes = styles();
  // const [pinHover, setPinHover] = React.useState(false);
  // const [pinned, setPinned] = React.useState(false);
  const hoverItem = hoverItemId === id;

  // const handlePinClick = () => {
  //   setPinned(!pinned);
  // };
  // const onMouseLeaveActionIcons = () => {
  //   setPinHover(false);
  // };
  // const onMouseHoverPinIcon = () => {
  //   setPinHover(true);
  // };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };

  return (
    <>
      <StyledListItem button onMouseEnter={onMouseHoverListItem}>
        <ListItemAvatar>
          <Avatar
            alt={docRevOwnerName}
            src={docRevOwnerAvatar ? docRevOwnerAvatar : "."}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={`${classes.typographyBold} ${classes.margin5}`}
                    color="textSecondary"
                    noWrap
                  >
                    {docRevOwnerName}
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={`${classes.typographyStatus} ${classes.margin7}`}
                    color="textSecondary"
                    noWrap
                  >
                    {!hoverItem && (
                      <NormalStyleChip
                        size="small"
                        color="primary"
                        icon={<RejectIcon />}
                        label={STATUS_TYPES_LABEL[status]}
                      />
                    )}
                    {hoverItem && (
                      <HoverStyleChip
                        color="primary"
                        size="small"
                        icon={<RejectSolidIcon />}
                        label={STATUS_TYPES_LABEL[status]}
                      />
                    )}
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    your
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Link
                    href={documentVersionPath(docRevId || "", docDocumentId)}
                    color="inherit"
                    className={classes.link}
                  >
                    <Typography
                      component="span"
                      variant="body2"
                      className={`${classes.typography} ${classes.margin5}`}
                      color="textPrimary"
                      noWrap
                    >
                      {docId}
                    </Typography>
                  </Link>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    to
                  </Typography>
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Link
                    href={documentVersionPath(docRevId || "", docDocumentId)}
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
                      {docRevName}
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true} className={classes.grayDot}></Grid>
                <Grid item={true} md={12} sm={12}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.timestampContainer}
                    color="textSecondary"
                    noWrap
                  >
                    {timestamp}
                  </Typography>
                </Grid>
              </Grid>
            </>
          }
        />
        {/* {hoverItem && (
          <Box
            component="div"
            className={classes.actionIcons}
            onMouseLeave={onMouseLeaveActionIcons}
          >
            <span className={classes.actionIcon}>
              {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
              {pinHover && (
                <StyleTooltip title="Pin item" placement="top" arrow>
                  <PinSolidIcon
                    onClick={handlePinClick}
                    onMouseLeave={onMouseLeaveActionIcons}
                  />
                </StyleTooltip>
              )}
            </span>
          </Box>
        )} */}
      </StyledListItem>
    </>
  );
};

export default taskApprovalPresenter;
