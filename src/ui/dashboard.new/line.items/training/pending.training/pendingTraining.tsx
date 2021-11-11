import {
  Grid,
  Link,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as OverdueIcon } from "../../../../../assets/images/overdue_status.svg";
import { ReactComponent as OverdueWhiteIcon } from "../../../../../assets/images/overdue_status_white.svg";
import { ReactComponent as TrainingIcon } from "../../../../../assets/images/training.svg";
import { ReactComponent as WarningIcon } from "../../../../../assets/images/warning_status.svg";
import { ReactComponent as WarningWhiteIcon } from "../../../../../assets/images/warning_status_white.svg";
import { TrainingStatus } from "../../../../../state/ducks/dashboard/types";
import Text from "../../../../components/Text";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import { HoverStyleChip } from "../../common/HoverStyleChip";
import { NormalStyleChip } from "../../common/NormalStyleChip";
import { StyledListItem } from "../../common/StyledListItem";
import { styles } from "./pendingTraining.styles";

interface Props {
  id: string;
  type: string;
  title: string;
  documentId: string;
  status: string;
  timestamp: string;
  verbose: string;
  dueDate: string;
  hoverItemId: string;
  onMouseHoverItem: (arId: string | undefined) => void;
}

const PendingTrainingPresenter: React.FunctionComponent<Props> = ({
  id,
  title,
  status,
  timestamp,
  dueDate,
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
  const existingId = "66bbda6c-65a3-47aa-b3f5-c9566d201d96";
  const documentRevId = "466b89d4-7067-4c80-a8c9-4e3f47f2a2f6";

  return (
    <StyledListItem button onMouseEnter={onMouseHoverItemListItem}>
      <ListItemIcon className={classes.listItemIcon}>
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
                        ? "your.training"
                        : "your.training.on"
                    }
                  />
                  &nbsp;
                </Typography>
              </Grid>
              <Grid item={true}>
                <Link
                  href={documentVersionPath(documentRevId, existingId)}
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
                    {id}&nbsp;
                  </Typography>
                </Link>
              </Grid>
              <Grid zeroMinWidth item={true} className={classes.truncateText}>
                <Link
                  href={documentVersionPath(documentRevId, existingId)}
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
                    {title}&nbsp;
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
                  is&nbsp;
                </Typography>
              </Grid>
              <Grid item={true}>
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
                        status === TrainingStatus.OVERDUE ? (
                          <OverdueIcon />
                        ) : (
                          <WarningIcon />
                        )
                      }
                      label={status}
                    />
                  )}
                  {hoverItem && (
                    <HoverStyleChip
                      {...{ status }}
                      color="primary"
                      size="small"
                      icon={
                        status === TrainingStatus.OVERDUE ? (
                          <OverdueWhiteIcon />
                        ) : (
                          <WarningWhiteIcon />
                        )
                      }
                      label={status}
                    />
                  )}
                </Typography>

              </Grid>
              <Grid
                item={true}
                className={
                  status === TrainingStatus.OVERDUE
                    ? classes.redDot
                    : classes.yellowDot
                }
              >

              </Grid>
              <Grid item={true}>
                <Typography
                  component="span"
                  variant="caption"
                  className={
                    status === TrainingStatus.OVERDUE
                      ? classes.typographyOverdue
                      : classes.typographyDueInfewDays
                  }
                  color="textSecondary"
                  noWrap
                >
                  {dueDate}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container={true}
              wrap="nowrap"
              justify="flex-start"
              alignItems="center"
            >

              <Grid item={true} className={classes.grayDot}>

              </Grid>
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
      {/* {hoverItem && (
        <Box component="div" className={classes.actionIcons}>
          {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
          {pinHover && (
            <StyledTooltip title="Pin item" placement="top" arrow>
              <PinSolidIcon
                onClick={handlePinClick}
                onMouseLeave={onMouseLeavePinIcon}
              />
            </StyledTooltip>
          )}
        </Box>
      )} */}
    </StyledListItem>
  );
};

export default PendingTrainingPresenter;
