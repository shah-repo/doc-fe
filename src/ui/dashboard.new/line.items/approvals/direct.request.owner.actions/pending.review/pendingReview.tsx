import {
  Grid,
  Link,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
} from "@material-ui/core";
import { size } from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { ReactComponent as InReviewIcon } from "../../../../../../assets/images/in_review_status.svg";
import { ReactComponent as InReviewWhiteIcon } from "../../../../../../assets/images/in_review_status_white.svg";
import { ReactComponent as PinIcon } from "../../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../../assets/images/pin_solid.svg";
import { Nullable } from "../../../../../../state/ducks/common/types";
import { dashboardMyFeedsActions } from "../../../../../../state/ducks/dashboard.new/my.feeds";
import { STATUS_TYPES_LABEL } from "../../../../../../state/ducks/dashboard.new/my.feeds/types";
import Text from "../../../../../components/Text";
import { documentVersionPath } from "../../../../../document.revision/utils/paths";
import Colors from "../../../../../layout/theme/utils/colors";
import { getDocIcon } from "../../../common/DocIcon";
import { HoverStyleChip } from "../../../common/HoverStyleChipPendingReview";
import { NormalStyleChip } from "../../../common/NormalStyleChipPendingReview";
import { StyledListItem } from "../../../common/StyledListItem";
import { StyleTooltip } from "../../../common/StyleTooltip";
import { DocTypeGroups } from "../../../common/types";
import EmailModal from "../../../dialogs/email/EmailDialog";
import { styles } from "./pendingReview.styles";

interface Props {
  id: string;
  docTypeGroup: DocTypeGroups;
  docDocumentId: string;
  docId: string;
  docRevId?: string;
  type: string;
  docRevName: string;
  status: string;
  timestamp: string;
  docRevPendingApprovals: any[];
  docRevApprovedApprovals: any[];
  hoverItemId: string;
  pendingEmailSentAt: Nullable<string>;
  onMouseHoverItem: (id: string) => void;
  pinned: boolean;
  pinLineItem: (id: string) => void;
  unPinLineItem: (id: string) => void;
}
const PendingReviewItemPresenter: React.FunctionComponent<Props> = ({
  id,
  docTypeGroup,
  docDocumentId,
  docId,
  docRevId,
  status,
  docRevName,
  timestamp,
  hoverItemId,
  docRevPendingApprovals,
  docRevApprovedApprovals,
  onMouseHoverItem,
  pinned,
  pinLineItem,
  unPinLineItem,
  pendingEmailSentAt,
}) => {
  const classes = styles();
  const dispatch = useDispatch();
  const [pinHover, setPinHover] = React.useState(false);
  const [emailModelopen, setEmailModelopen] = React.useState(false);
  const [lastEmailSent, setLastEmailSent] = React.useState(false);
  const hoverItem = hoverItemId === id;
  const handlePinClick = () => {
    pinLineItem(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem(id);
  };
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };
  const onMouseLeavePinIcon = () => {
    setPinHover(false);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  const openApproversModel = (e) => {
    e.stopPropagation();
    setLastEmailSent(false);
    setEmailModelopen(true);
  };
  const handleEmailModelClose = () => {
    setEmailModelopen(false);
  };
  const onClose = () => {
    handleEmailModelClose();
    if (lastEmailSent) {
      dispatch(dashboardMyFeedsActions.loadMyFeedsList());
    }
  };
  return (
    <>
      <StyledListItem
        style={hoverItem ? { backgroundColor: Colors.sky_blue } : {}}
        button
        onMouseEnter={onMouseHoverListItem}
      >
        <ListItemIcon>{getDocIcon(docTypeGroup)}</ListItemIcon>
        <ListItemText
          primary={
            <>
              <Grid container={true} wrap="nowrap">
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
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <StyleTooltip title={docRevName} placement="top">
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
                  </StyleTooltip>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    <Text translation="common.is" />
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={`${classes.typographyStatus} ${classes.margin7}`}
                    color="textSecondary"
                    noWrap
                    onClick={openApproversModel}
                  >
                    {!hoverItem && (
                      <NormalStyleChip
                        size="small"
                        color="primary"
                        icon={<InReviewIcon />}
                        label={STATUS_TYPES_LABEL[status]}
                      />
                    )}
                    {hoverItem && (
                      <HoverStyleChip
                        color="primary"
                        size="small"
                        icon={<InReviewWhiteIcon />}
                        label={STATUS_TYPES_LABEL[status]}
                      />
                    )}
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    <Text translation="pending.approval" />
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid
                  zeroMinWidth
                  item={true}
                  className={`${classes.truncateText} ${classes.margin7}`}
                >
                  <StyleTooltip
                    title={
                      <>
                        <Text
                          translation="assigned.users.count"
                          values={{
                            count:
                              size(docRevPendingApprovals) +
                              size(docRevApprovedApprovals),
                          }}
                        />
                        <br />
                        <Text
                          translation="approved.and.pending.count"
                          values={{
                            approved: size(docRevApprovedApprovals),
                            pending: size(docRevPendingApprovals),
                          }}
                        />
                      </>
                    }
                    placement="top-start"
                  >
                    <Link
                      href="#"
                      onClick={openApproversModel}
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
                        {docRevPendingApprovals !== undefined
                          ? docRevPendingApprovals
                            .map((approver) => approver.userName)
                            .join(", ")
                          : ""}
                      </Typography>
                    </Link>
                  </StyleTooltip>
                </Grid>
                <Grid
                  item={true}
                  className={`${classes.grayDot} ${classes.margin5}`}
                ></Grid>
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
        {hoverItem && !pinned && (
          <div className={classes.actionIcons}>
            {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
            {pinHover && (
              <StyleTooltip
                title={<Text translation="common.pin" />}
                placement="top"
                arrow
              >
                <PinSolidIcon
                  onClick={handlePinClick}
                  onMouseLeave={onMouseLeavePinIcon}
                />
              </StyleTooltip>
            )}
          </div>
        )}
        {pinned && (
          <div className={classes.actionIcons}>
            <StyleTooltip
              title={<Text translation="common.unpin" />}
              placement="top"
              arrow
            >
              <PinSolidIcon onClick={handleUnPinClick} />
            </StyleTooltip>
          </div>
        )}
      </StyledListItem>
      <Modal
        open={emailModelopen}
        onClose={onClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <EmailModal
          id={id}
          handleEmailModelClose={onClose}
          pendingApprovers={docRevPendingApprovals}
          setLastEmailSent={setLastEmailSent}
          approvedApprovers={docRevApprovedApprovals}
          pendingEmailSentAt={pendingEmailSentAt}
        />
      </Modal>
    </>
  );
};

export default PendingReviewItemPresenter;
