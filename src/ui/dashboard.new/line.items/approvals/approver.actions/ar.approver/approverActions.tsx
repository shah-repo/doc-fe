import {
  Grid,
  Link,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from "@material-ui/core";
import React from "react";

import { ReactComponent as RejectSolidIcon } from "../../../../../../assets/images/reject_status.svg";
import { ReactComponent as RejectIcon } from "../../../../../../assets/images/reject_status_solid.svg";
import { ReactComponent as ApprovedIcon } from "../../../../../../assets/images/approved_status.svg";
import { ReactComponent as ApprovedWhiteIcon } from "../../../../../../assets/images/approved_status_white.svg";
// import { ReactComponent as POIcon } from "../../../../../assets/images/po.svg";
import { changeRequestEditPath } from "../../../../../change.request/utils/paths";
import { Nullable } from "../../../../../../state/ducks/common/types";
import { STATUS_TYPES_LABEL } from "../../../../../../state/ducks/dashboard.new/my.feeds/types";
// import Text from "../../../../../components/Text";
import Colors from "../../../../../layout/theme/utils/colors";
import { HoverStyleChip } from "../../../common/HoverStyleChipApprovalApproved";
import { NormalStyleChip } from "../../../common/NormalStyleChipApprovalApproved";
import { HoverStyleChip as RejectedHoverStyleChip } from "../../../common/HoverStyleChipApprovalRejected";
import { NormalStyleChip as RejectedNormalStyleChip } from "../../../common/NormalStyleChipApprovalRejected";
import { StyledListItem } from "../../../common/StyledListItem";
import { styles } from "./approverActions.styles";

interface Props {
  id: string;
  arId: string;
  arChangeRequestId: string;
  type: string;
  arTitle: string;
  approvalStatusChanged: string;
  timestamp: string;
  approverName: string;
  approverAvatar: Nullable<string>;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
}
const ARApproverActionItemPresenter: React.FunctionComponent<Props> = ({
  id,
  arId,
  arChangeRequestId,
  approvalStatusChanged,
  arTitle,
  approverName,
  approverAvatar,
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
          <Avatar
            className={classes.avatar}
            alt={approverName}
            src={approverAvatar ? approverAvatar : "."}
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
                    {approverName}
                  </Typography>
                </Grid>
                {STATUS_TYPES_LABEL.REJECTED === approvalStatusChanged && (
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
                          label={STATUS_TYPES_LABEL[approvalStatusChanged]}
                        />
                      )}
                      {hoverItem && (
                        <RejectedHoverStyleChip
                          color="primary"
                          size="small"
                          icon={<RejectSolidIcon />}
                          label={STATUS_TYPES_LABEL[approvalStatusChanged]}
                        />
                      )}
                    </Typography>
                  </Grid>
                )}
                {STATUS_TYPES_LABEL.APPROVED === approvalStatusChanged && (
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
                          label={STATUS_TYPES_LABEL[approvalStatusChanged]}
                        />
                      )}
                      {hoverItem && (
                        <HoverStyleChip
                          color="primary"
                          size="small"
                          icon={<ApprovedWhiteIcon />}
                          label={STATUS_TYPES_LABEL[approvalStatusChanged]}
                        />
                      )}
                    </Typography>
                  </Grid>
                )}
                {STATUS_TYPES_LABEL.APPROVED !== approvalStatusChanged &&
                  STATUS_TYPES_LABEL.REJECTED !== approvalStatusChanged && (
                    <Grid item={true}>
                      <Typography
                        component="span"
                        variant="caption"
                        className={`${classes.typographyStatus} ${classes.margin5}`}
                        color="textSecondary"
                        noWrap
                      >
                        {approvalStatusChanged}
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
                    <Text translation="your" />
                  </Typography>
                </Grid> */}
                <Grid item={true}>
                  <Link
                    href={changeRequestEditPath(arChangeRequestId)}
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
                      {arId}
                    </Typography>
                  </Link>
                </Grid>
                {/* {arTitle && (
                  <Grid item={true}>
                    <Typography
                      component="span"
                      variant="body2"
                      className={`${classes.typography} ${classes.margin5}`}
                      color="textPrimary"
                      noWrap
                    >
                      <Text translation="to" />
                    </Typography>
                  </Grid>
                )} */}
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Link
                    href={changeRequestEditPath(arChangeRequestId)}
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
                      {arTitle}
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

export default ARApproverActionItemPresenter;
