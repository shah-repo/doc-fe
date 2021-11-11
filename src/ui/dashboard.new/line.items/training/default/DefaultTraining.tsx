import {
  Grid,
  Link,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as ApprovedIcon } from "../../../../../assets/images/approved_status.svg";
import { ReactComponent as ApprovedWhiteIcon } from "../../../../../assets/images/approved_status_white.svg";
import { ReactComponent as OverdueIcon } from "../../../../../assets/images/overdue_status.svg";
import { ReactComponent as OverdueWhiteIcon } from "../../../../../assets/images/overdue_status_white.svg";
import { ReactComponent as TrainingIcon } from "../../../../../assets/images/training.svg";
import { ReactComponent as WarningIcon } from "../../../../../assets/images/warning_status.svg";
import { ReactComponent as WarningWhiteIcon } from "../../../../../assets/images/warning_status_white.svg";
import {
  TrainingStatus,
  TrainingStatusLabels,
} from "../../../../../state/ducks/dashboard/types";
import Text from "../../../../components/Text";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import { StyledListItem } from "../../common/StyledListItem";
import { HoverStyleChip } from "./DefaultHoverStyleChip";
import { NormalStyleChip } from "./DefaultNormalStyleChip";
import { styles } from "./DefaultTraining.styles";

interface Props {
  id: string;
  type: string;
  docRevName: string | undefined;
  docId: string | undefined;
  docDocumentId: string | undefined;
  docRevId: string | undefined;
  status: string | undefined;
  timestamp: string | undefined;
  dueOn: string | undefined;
  hoverItemId: string;
  onMouseHoverItem: (arId: string | undefined) => void;
}

const PendingTrainingPresenter: React.FunctionComponent<Props> = ({
  id,
  docDocumentId,
  docRevId,
  docRevName,
  status,
  timestamp,
  dueOn,
  docId,
  hoverItemId,
  onMouseHoverItem,
}) => {
  const classes = styles();
  // const [pinned, setPinned] = React.useState(false);
  // const [pinHover, setPinHover] = React.useState(false);
  const hoverItem = hoverItemId === id;
  // const onMouseHoverPinIcon = () => {
  //   setPinHover(true);
  // };
  // const onMouseLeavePinIcon = () => {
  //   setPinHover(false);
  // };
  // const handlePinClick = () => {
  //   setPinned(!pinned);
  // };
  const onMouseHoverItemListItem = () => {
    onMouseHoverItem(id);
  };
  docDocumentId = docDocumentId || "";
  docRevId = docRevId || "";
  return (
    <StyledListItem button onMouseEnter={onMouseHoverItemListItem}>
      <ListItemIcon>
        <TrainingIcon />
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
                    className={classes.typography}
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
                    &nbsp;
                  </Typography>
                </Grid>
              )}
              <Grid item={true}>
                <Link
                  href={documentVersionPath(docRevId, docDocumentId)}
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
              </Grid>
              <Grid zeroMinWidth item={true} className={classes.truncateText}>
                <Link
                  href={documentVersionPath(docRevId, docDocumentId)}
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
                    {docRevName}&nbsp;
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
                  {TrainingStatus.ASSIGNED !== status ? "is" : ""}&nbsp;
                  {TrainingStatus.ASSIGNED === status && (
                    <Text translation="training.assign" />
                  )}
                </Typography>
              </Grid>

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
                &nbsp;&nbsp;
              </Grid>
              {status && TrainingStatus.COMPLETED !== status && (
                <Grid
                  item={true}
                  className={
                    TrainingStatus.ASSIGNED === status
                      ? classes.grayDot
                      : status === TrainingStatus.OVERDUE
                        ? classes.redDot
                        : classes.yellowDot
                  }
                >
                  &nbsp;
                </Grid>
              )}
              {status && TrainingStatus.COMPLETED !== status && (
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
                    &nbsp; {dueOn}
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid
              container={true}
              wrap="nowrap"
              justify="flex-start"
              alignItems="center"
            >
              &nbsp;
              <Grid item={true} className={classes.grayDot}>
                &nbsp;
              </Grid>
              <Grid item={true}>
                <Typography
                  component="span"
                  variant="caption"
                  className={classes.timestampContainer}
                  color="textSecondary"
                  noWrap
                >
                  &nbsp; {timestamp}
                </Typography>
              </Grid>
            </Grid>
          </>
        }
      />
      {/* {hoverItem && (
        <Box component="div" className={classes.actionIcons}>
          {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
          {pinHover && (
            <StyleTooltip title="Pin item" placement="top" arrow>
              <PinSolidIcon
                onClick={handlePinClick}
                onMouseLeave={onMouseLeavePinIcon}
              />
            </StyleTooltip>
          )}
        </Box>
      )} */}
    </StyledListItem>
  );
};

export default PendingTrainingPresenter;
