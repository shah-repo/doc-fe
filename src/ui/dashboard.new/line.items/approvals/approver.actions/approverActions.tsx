import {
  Avatar,
  Grid,
  Link,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as ApprovedIcon } from "../../../../../assets/images/approved_status.svg";
import { ReactComponent as ApprovedWhiteIcon } from "../../../../../assets/images/approved_status_white.svg";
import { ReactComponent as RejectSolidIcon } from "../../../../../assets/images/reject_status.svg";
import { ReactComponent as RejectIcon } from "../../../../../assets/images/reject_status_solid.svg";
import { Nullable } from "../../../../../state/ducks/common/types";
import { STATUS_TYPES_LABEL } from "../../../../../state/ducks/dashboard.new/my.feeds/types";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import Colors from "../../../../layout/theme/utils/colors";
import { getInitalsFromName } from "../../../../components/icons/avatar/helpers";
import { HoverStyleChip } from "../../common/HoverStyleChipApprovalApproved";
import { HoverStyleChip as RejectedHoverStyleChip } from "../../common/HoverStyleChipApprovalRejected";
import { NormalStyleChip } from "../../common/NormalStyleChipApprovalApproved";
import { NormalStyleChip as RejectedNormalStyleChip } from "../../common/NormalStyleChipApprovalRejected";
import { StyledListItem } from "../../common/StyledListItem";
import { styles } from "./approverActions.styles";

interface Props {
  id: string;
  docDocumentId: string;
  docId: string;
  docRevId?: string;
  type: string;
  docRevName: string;
  status: string;
  timestamp: string;
  approverName: string;
  approverAvatar: Nullable<string>;
  approverInitialColor: string;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
}
const ApproverActionItemPresenter: React.FunctionComponent<Props> = ({
  id,
  docDocumentId,
  docId,
  docRevId,
  status,
  docRevName,
  approverName,
  approverAvatar,
  approverInitialColor,
  timestamp,
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
  // const onMouseHoverPinIcon = () => {
  //   setPinHover(true);
  // };
  // const onMouseLeavePinIcon = () => {
  //   setPinHover(false);
  // };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  return (
    <>
      <StyledListItem
        style={hoverItem ? { backgroundColor: Colors.sky_blue } : {}}
        button
        onMouseEnter={onMouseHoverListItem}
      >
        <ListItemAvatar>
          {approverAvatar ? (
            <Avatar
              style={{ backgroundColor: `${approverInitialColor}` }}
              className={classes.avatar}
              alt={approverName}
              src={approverAvatar}
            />
          ) : (
            <Avatar
              style={{ backgroundColor: `${approverInitialColor}` }}
              className={classes.avatar}
            >
              {getInitalsFromName(approverName)}
            </Avatar>
          )}
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
                    {approverName}
                  </Typography>
                </Grid>
                {STATUS_TYPES_LABEL.REJECTED === status && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="caption"
                      className={`${classes.typographyStatus} ${classes.margin5}`}
                      color="textSecondary"
                      noWrap
                    >
                      {!hoverItem && (
                        <RejectedNormalStyleChip
                          size="small"
                          color="primary"
                          icon={<RejectIcon />}
                          label={STATUS_TYPES_LABEL[status]}
                        />
                      )}
                      {hoverItem && (
                        <RejectedHoverStyleChip
                          color="primary"
                          size="small"
                          icon={<RejectSolidIcon />}
                          label={STATUS_TYPES_LABEL[status]}
                        />
                      )}
                    </Typography>
                  </Grid>
                )}
                {STATUS_TYPES_LABEL.APPROVED === status && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="caption"
                      className={`${classes.typographyStatus} ${classes.margin5}`}
                      color="textSecondary"
                      noWrap
                    >
                      {!hoverItem && (
                        <NormalStyleChip
                          size="small"
                          color="primary"
                          icon={<ApprovedIcon />}
                          label={STATUS_TYPES_LABEL[status]}
                        />
                      )}
                      {hoverItem && (
                        <HoverStyleChip
                          color="primary"
                          size="small"
                          icon={<ApprovedWhiteIcon />}
                          label={STATUS_TYPES_LABEL[status]}
                        />
                      )}
                    </Typography>
                  </Grid>
                )}
                {STATUS_TYPES_LABEL.APPROVED !== status &&
                  STATUS_TYPES_LABEL.REJECTED !== status && (
                    <Grid item={true}>
                      <Typography
                        component="span"
                        variant="caption"
                        className={`${classes.typographyStatus} ${classes.margin5}`}
                        color="textSecondary"
                        noWrap
                      >
                        {status}
                      </Typography>
                    </Grid>
                  )}
                {/* <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    <Text translation="common.your" />
                  </Typography>
                </Grid> */}
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
                {/* {docRevName && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.typography}
                      color="textPrimary"
                      noWrap
                    >
                      <Text translation="common.to" />
                    </Typography>
                  </Grid>
                )} */}
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Link
                    href={documentVersionPath(docRevId || "", docDocumentId)}
                    color="inherit"
                    className={classes.link}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      className={`${classes.typographyBold} ${classes.margin5}`}
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
                <Grid item={true}>
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
        {/* { hoverItem && (
          <div className={classes.actionIcons}>
            {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
            {pinHover && (
              <StyleTooltip title="Pin item" placement="top" arrow>
                <PinSolidIcon
                  onClick={handlePinClick}
                  onMouseLeave={onMouseLeavePinIcon}
                />
              </StyleTooltip>
            )}
          </div>
        )} */}
      </StyledListItem>
    </>
  );
};

export default ApproverActionItemPresenter;
