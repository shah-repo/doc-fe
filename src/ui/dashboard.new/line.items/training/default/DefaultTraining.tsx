import {
  Box,
  Grid,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as ApprovedIcon } from "../../../../../assets/images/approved_status.svg";
import { ReactComponent as ApprovedWhiteIcon } from "../../../../../assets/images/approved_status_white.svg";
import { ReactComponent as OverdueIcon } from "../../../../../assets/images/overdue_status.svg";
import { ReactComponent as OverdueWhiteIcon } from "../../../../../assets/images/overdue_status_white.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as TrainingIcon } from "../../../../../assets/images/training.svg";
import { ReactComponent as WarningIcon } from "../../../../../assets/images/warning_status.svg";
import { ReactComponent as WarningWhiteIcon } from "../../../../../assets/images/warning_status_white.svg";
import { Nullable } from "../../../../../state/ducks/common/types";
import {
  TrainingStatus,
  TrainingStatusLabels,
} from "../../../../../state/ducks/dashboard.new/my.feeds/types";
import Text from "../../../../components/Text";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import DocId from "../../common/DocId/presenter";
import DocTitle from "../../common/DocTitle/presenter";
import { StyledListItem } from "../../common/StyledListItem";
import { StyleTooltip } from "../../common/StyleTooltip";
import { HoverStyleChip } from "./DefaultHoverStyleChip";
import { NormalStyleChip } from "./DefaultNormalStyleChip";
import { styles } from "./DefaultTraining.styles";

interface Props {
  id: string;
  type: string;
  docRevName: Nullable<string>;
  docRevVersion: string;
  docId: string;
  docDocumentId: string;
  docRevId: string;
  status: string;
  timestamp: string;
  dueOn: Nullable<string>;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
  pinned: boolean;
  pinLineItem: (id: string) => void;
  unPinLineItem: (id: string) => void;
}

const PendingTrainingPresenter: React.FunctionComponent<Props> = ({
  id,
  docDocumentId,
  docRevId,
  docRevName,
  docRevVersion,
  status,
  timestamp,
  dueOn,
  docId,
  hoverItemId,
  onMouseHoverItem,
  pinned,
  pinLineItem,
  unPinLineItem,
}) => {
  const classes = styles();
  const [pinHover, setPinHover] = React.useState(false);
  const hoverItem = hoverItemId === id;
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };
  const onMouseLeavePinIcon = () => {
    setPinHover(false);
  };
  const handlePinClick = () => {
    pinLineItem(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem(id);
  };
  const onMouseHoverItemListItem = () => {
    onMouseHoverItem(id);
  };
  docDocumentId = docDocumentId || "";
  docRevId = docRevId || "";
  return (
    <StyledListItem button onMouseEnter={onMouseHoverItemListItem} className={classes.buttoncursor} disableRipple>
      <ListItemIcon>
        <TrainingIcon height={30} width={30} />
      </ListItemIcon>
      <ListItemText
        primary={
          <>
            <Grid
              container={true}
              wrap="nowrap"
              justify="flex-start"
              alignItems="center"
            >
              {TrainingStatus.ASSIGNED !== status && (
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    <Text
                      translation={
                        status === TrainingStatus.OVERDUE
                          ? "training.your"
                          : "training.your.on"
                      }
                    />
                  </Typography>
                </Grid>
              )}
              <Grid item={true}>
                <DocId url={documentVersionPath(docRevId, docDocumentId)} docId={docId} />
              </Grid>
              <Grid zeroMinWidth item={true} className={classes.truncateText}>
                <DocTitle
                  url={documentVersionPath(docRevId, docDocumentId)}
                  docRevVersion={docRevVersion}
                  docRevName={docRevName}
                />
              </Grid>
              <Grid item={true}>
                <Typography
                  component="span"
                  variant="body2"
                  className={`${classes.typography} ${classes.margin5}`}
                  color="textPrimary"
                  noWrap
                >
                  {TrainingStatus.ASSIGNED !== status ? "is" : ""}
                  {TrainingStatus.ASSIGNED === status && (
                    <Text translation="training.assign" />
                  )}
                </Typography>
              </Grid>

              {TrainingStatus[status] && (
                <Grid item={true}>
                  {TrainingStatus.ASSIGNED !== status && (
                    <Typography
                      component="span"
                      variant="caption"
                      className={classes.typographyStatus}
                      color="textSecondary"
                      noWrap
                    >
                      {!hoverItem && (
                        <NormalStyleChip
                          {...{ status }}
                          size="small"
                          color="primary"
                          icon={
                            status === TrainingStatus.COMPLETED ? (
                              <ApprovedIcon />
                            ) : status === TrainingStatus.OVERDUE ? (
                              <OverdueIcon />
                            ) : (
                              <WarningIcon />
                            )
                          }
                          label={status && TrainingStatusLabels[status]}
                        />
                      )}
                      {hoverItem && (
                        <HoverStyleChip
                          {...{ status }}
                          color="primary"
                          size="small"
                          icon={
                            status === TrainingStatus.COMPLETED ? (
                              <ApprovedWhiteIcon />
                            ) : status === TrainingStatus.OVERDUE ? (
                              <OverdueWhiteIcon />
                            ) : (
                              <WarningWhiteIcon />
                            )
                          }
                          label={status && TrainingStatusLabels[status]}
                        />
                      )}
                    </Typography>
                  )}
                </Grid>
              )}
              {TrainingStatus[status] &&
                TrainingStatus.COMPLETED !== status && (
                <Grid
                  item={true}
                  className={
                    TrainingStatus.ASSIGNED === status
                      ? classes.grayDot
                      : status === TrainingStatus.OVERDUE
                        ? classes.redDot
                        : classes.yellowDot
                  }
                ></Grid>
              )}
              {TrainingStatus[status] && TrainingStatus.COMPLETED !== status && (
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={
                      status === TrainingStatus.ASSIGNED
                        ? classes.typographyAssigned
                        : status === TrainingStatus.OVERDUE
                          ? classes.typographyOverdue
                          : classes.typographyDueInfewDays
                    }
                    color="textSecondary"
                    noWrap
                  >
                    {dueOn}
                  </Typography>
                </Grid>
              )}
              {!TrainingStatus[status] && (
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.typographyStatus}
                  color="textSecondary"
                  noWrap
                >
                  {status}
                </Typography>
              )}
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
      {hoverItem && !pinned && (
        <Box component="div" className={classes.actionIcons}>
          {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} className={classes.cursorPointer} />}
          {pinHover && (
            <StyleTooltip
              title={<Text translation="common.pin" />}
              placement="top"
              arrow
            >
              <PinSolidIcon
                onClick={handlePinClick}
                onMouseLeave={onMouseLeavePinIcon}
                className={classes.cursorPointer}
              />
            </StyleTooltip>
          )}
        </Box>
      )}
      {pinned && (
        <Box component="div" className={classes.actionIcon}>
          <StyleTooltip
            title={<Text translation="common.unpin" />}
            placement="top"
            arrow
          >
            <PinSolidIcon onClick={handleUnPinClick} className={classes.cursorPointer} />
          </StyleTooltip>
        </Box>
      )}
    </StyledListItem>
  );
};

export default PendingTrainingPresenter;
