import {
  Box,
  Chip,
  Grid,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { size } from "lodash";
import React from "react";
import { ReactComponent as OverdueIcon } from "../../../../../assets/images/overdue_status.svg";
import { ReactComponent as OverdueWhiteIcon } from "../../../../../assets/images/overdue_status_white.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as TrainingIcon } from "../../../../../assets/images/training.svg";
import { ReactComponent as WarningIcon } from "../../../../../assets/images/warning_status.svg";
import { ReactComponent as WarningWhiteIcon } from "../../../../../assets/images/warning_status_white.svg";
import { TrainingStatus } from "../../../../../state/ducks/dashboard/types";
import Text from "../../../../components/Text";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import Colors from "../../../../layout/theme/utils/colors";
import { styles } from "./newTraining.styles";

interface Props {
  id: string;
  type: string;
  title: string;
  documentId: string;
  status: string;
  timestamp: string;
  verbose: string;
  dueDate: string;
  approvers: string[];
  hoverItemId: string;
  onMouseHoverItem: (arId: string | undefined) => void;
}

const PendingTrainingPresenter: React.FunctionComponent<Props> = ({
  id,
  title,
  status,
  timestamp,
  dueDate,
  approvers,
  onMouseHoverItem,
  hoverItemId,
}) => {
  const classes = styles();
  const StyledListItem = withStyles({
    root: {
      "&:hover": {
        backgroundColor: Colors.sky_blue,
      },
    },
  })(ListItem);
  const NormalStyleChip = withStyles({
    root: {
      backgroundColor: Colors.white,
      borderRadius: "3px",
    },
    colorPrimary: {
      color:
        status === TrainingStatus.OVERDUE
          ? Colors.latest_red_varient
          : Colors.latest_yellow_varient,
    },
  })(Chip);
  const HoverStyleChip = withStyles({
    root: {
      backgroundColor:
        status === TrainingStatus.OVERDUE
          ? Colors.latest_red_varient
          : Colors.latest_yellow_varient,
      borderRadius: "3px",
    },
    colorPrimary: {
      color: Colors.white,
    },
  })(Chip);

  const StyleTooltip = withStyles({
    arrow: {
      color: Colors.black,
    },
    tooltip: {
      backgroundColor: Colors.black,
    },
    tooltipPlacementTop: {
      margin: "8px 0",
    },
  })(Tooltip);
  const [pinned, setPinned] = React.useState(false);
  const hoverItem = hoverItemId === id;
  const handlePinClick = () => {
    setPinned(!pinned);
  };
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
                  variant="caption"
                  className={classes.typographyStatus}
                  color="textSecondary"
                  noWrap
                >
                  {!hoverItem && (
                    <NormalStyleChip
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
                &nbsp;&nbsp;
              </Grid>
              <Grid
                item={true}
                className={
                  status === TrainingStatus.OVERDUE
                    ? classes.redDot
                    : classes.yellowDot
                }
              >
                &nbsp;
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
                  &nbsp; {dueDate}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container={true}
              wrap="nowrap"
              justify="flex-start"
              alignItems="center"
            >
              <Grid zeroMinWidth item={true} className={classes.truncateText}>
                <StyleTooltip
                  title={
                    <Typography color="inherit">
                      <Text
                        translation="assigned.users.count"
                        values={{ count: size(approvers) }}
                      />
                      <br />
                      <Text
                        translation="approved.and.pending.count"
                        values={{ approved: 4, pending: 6 }}
                      />
                    </Typography>
                  }
                  placement="top-start"
                >
                  <Link href="#" color="inherit" className={classes.link}>
                    <Typography
                      component="span"
                      variant="caption"
                      className={classes.typographyBold}
                      color="textSecondary"
                      noWrap
                    >
                      {approvers.join(",")}
                    </Typography>
                  </Link>
                </StyleTooltip>
                &nbsp;
              </Grid>
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
      {hoverItem && (
        <Box component="div" className={classes.actionIcons}>
          <PinIcon onClick={handlePinClick} />
        </Box>
      )}
    </StyledListItem>
  );
};

export default PendingTrainingPresenter;
