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
import { ReactComponent as OverdueIcon } from "../../../../../assets/images/overdue_status.svg";
import { ReactComponent as OverdueWhiteIcon } from "../../../../../assets/images/overdue_status_white.svg";
import { ReactComponent as TrainingIcon } from "../../../../../assets/images/training.svg";
import { ReactComponent as WarningIcon } from "../../../../../assets/images/warning_status.svg";
import { ReactComponent as WarningWhiteIcon } from "../../../../../assets/images/warning_status_white.svg";
import { TrainingStatus } from "../../../../../state/ducks/dashboard/types";
import Text from "../../../../components/Text";
import { documentVersionPath } from "../../../../document.revision/utils/paths";
import TrainingEmailModal from "../../../modal.popups/email/TrainingEmailModal";
import { HoverStyleChip } from "../../common/HoverStyleChip";
import { NormalStyleChip } from "../../common/NormalStyleChip";
import { StyledListItem } from "../../common/StyledListItem";
import { StyledTooltip } from "../../common/StyledTooltip";
import { styles } from "./newTraining.styles";

interface Props {
  id: string;
  docId: string;
  type: string;
  docRevName: string;
  docDocumentId: string;
  docRevId: string;
  trainingStatus: string;
  timestamp: string;
  pendingTrainees: any;
  hoverItemId: string;
  onMouseHoverItem: (arId: string | undefined) => void;
}

const PendingTrainingPresenter: React.FunctionComponent<Props> = ({
  id,
  docId,
  docRevId,
  docDocumentId,
  docRevName,
  trainingStatus,
  timestamp,
  pendingTrainees,
  onMouseHoverItem,
  hoverItemId,
}) => {
  const classes = styles();
  // const dueDate = "JAN 12";
  // const [pinned, setPinned] = React.useState(false);
  // const [pinHover, setPinHover] = React.useState(false);
  const [emailModelopen, setEmailModelopen] = React.useState(false);
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
  const openDueModel = (e) => {
    e.stopPropagation();
    setEmailModelopen(true);
  };
  const handleEmailModelClose = () => {
    setEmailModelopen(false);
  };
  // const dueApprovers = pendingTrainees.map((name, index) => ({
  //   listitemicon: index,
  //   userName: employeeId,
  //   employeeId: employeeId,
  // }));
  const pendingTraineesNames = pendingTrainees
    .map((trainee) => {
      return trainee.userName;
    })
    .join(",");

  return (
    <>
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
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    <Text
                      translation={
                        trainingStatus === TrainingStatus.OVERDUE
                          ? "your.training"
                          : "your.training.on"
                      }
                    />
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Link
                    href={documentVersionPath(docRevId, docDocumentId)}
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
                  <Link
                    href={documentVersionPath(docRevId, docDocumentId)}
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
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    onClick={openDueModel}
                    className={`${classes.typographyStatus} ${classes.margin7}`}
                    color="textSecondary"
                    noWrap
                  >
                    {!hoverItem && (
                      <NormalStyleChip
                        {...{ trainingStatus }}
                        size="small"
                        color="primary"
                        icon={
                          trainingStatus === TrainingStatus.OVERDUE ? (
                            <OverdueIcon />
                          ) : (
                            <WarningIcon />
                          )
                        }
                        label={trainingStatus}
                      />
                    )}
                    {hoverItem && (
                      <HoverStyleChip
                        {...{ trainingStatus }}
                        color="primary"
                        size="small"
                        icon={
                          trainingStatus === TrainingStatus.OVERDUE ? (
                            <OverdueWhiteIcon />
                          ) : (
                            <WarningWhiteIcon />
                          )
                        }
                        label={trainingStatus}
                      />
                    )}
                  </Typography>
                </Grid>
                {/* <Grid
                  item={true}
                  className={
                    trainingStatus === TrainingStatus.OVERDUE
                      ? `${classes.redDot} ${classes.margin7}`
                      : `${classes.yellowDot} ${classes.margin7}`
                  }
                ></Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={
                      trainingStatus === TrainingStatus.OVERDUE
                        ? classes.typographyOverdue
                        : classes.typographyDueInfewDays
                    }
                    color="textSecondary"
                    noWrap
                  >
                    {dueDate}
                  </Typography>
                </Grid> */}
              </Grid>
              <Grid
                container={true}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <StyledTooltip
                    title={
                      <Typography color="inherit">
                        <Text
                          translation="assigned.users.count"
                          values={{ count: size(pendingTrainees) }}
                        />
                        <br />
                        <Text
                          translation="approved.and.pending.count"
                          values={{
                            approved: 0,
                            pending: pendingTrainees.length,
                          }}
                        />
                      </Typography>
                    }
                    placement="top-start"
                  >
                    <Link
                      href="#"
                      color="inherit"
                      className={classes.link}
                      onClick={openDueModel}
                    >
                      <Typography
                        component="span"
                        variant="caption"
                        className={`${classes.typographyBold} ${classes.margin7}`}
                        color="textSecondary"
                        noWrap
                      >
                        {pendingTraineesNames}
                      </Typography>
                    </Link>
                  </StyledTooltip>
                </Grid>
                <Grid
                  item={true}
                  className={`${classes.grayDot} ${classes.margin7}`}
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
      <Modal
        open={emailModelopen}
        onClose={handleEmailModelClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <TrainingEmailModal
          handleEmailModelClose={handleEmailModelClose}
          dueApprovers={pendingTrainees}
        />
      </Modal>
    </>
  );
};

export default PendingTrainingPresenter;
