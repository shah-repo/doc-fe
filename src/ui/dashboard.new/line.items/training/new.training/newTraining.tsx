import {
  Box, Grid,
  Link,
  ListItemIcon,
  ListItemText,
  Modal, Typography,
} from "@material-ui/core";
import { size } from "lodash";
import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import { ReactComponent as OverdueIcon } from "../../../../../assets/images/overdue_status.svg";
import { ReactComponent as OverdueWhiteIcon } from "../../../../../assets/images/overdue_status_white.svg";
import { ReactComponent as PinIcon } from "../../../../../assets/images/pin.svg";
import { ReactComponent as PinSolidIcon } from "../../../../../assets/images/pin_solid.svg";
import { ReactComponent as TrainingIcon } from "../../../../../assets/images/training.svg";
import { ReactComponent as WarningIcon } from "../../../../../assets/images/warning_status.svg";
import { ReactComponent as WarningWhiteIcon } from "../../../../../assets/images/warning_status_white.svg";
import { Nullable } from "../../../../../state/ducks/common/types";
import { trainingActions } from "../../../../../state/ducks/dashboard.new/training";
import { TrainingStatus } from "../../../../../state/ducks/dashboard/types";
import { tableSearchActions } from "../../../../../state/ducks/tableSearch";
import { TableSearchQueryType } from "../../../../components/table/types";
import Text from "../../../../components/Text";
import { TRAINING_URL } from "../../../../constants/urls";
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
  docRevVersion: string;
  docDocumentId: string;
  docRevId: string;
  trainingStatus: string;
  timestamp: string;
  pendingTrainees: any;
  hoverItemId: string;
  pendingEmailSentAt: Nullable<string>;
  onMouseHoverItem: (arId: string | undefined) => void;
  pinned: boolean;
  pinLineItem: (id: string) => void;
  unPinLineItem: (id: string) => void;
}

const PendingTrainingPresenter: React.FunctionComponent<Props> = ({
  id,
  docId,
  docRevId,
  docDocumentId,
  docRevName,
  docRevVersion,
  trainingStatus,
  timestamp,
  pendingTrainees,
  pendingEmailSentAt,
  onMouseHoverItem,
  hoverItemId,
  pinned,
  pinLineItem,
  unPinLineItem,
}) => {
  const classes = styles();
  const dispatch = useDispatch();
  const [pinHover, setPinHover] = React.useState(false);
  const [emailModelopen, setEmailModelopen] = React.useState(false);
  const [lastEmailSent, setLastEmailSent] = React.useState(false);
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
  const openDueModel = (e) => {
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
      dispatch(trainingActions.loadTrainingList());
    }
  };
  const pendingTraineesNames = pendingTrainees
    .map((trainee) => trainee.userName)
    .join(", ");
  const setTrainingSearchCriteria = () => {
    const searchCriteria: TableSearchQueryType = {
      isCompleted: false,
      docId,
      docRevTitle: docRevName,
      revision: docRevVersion,
    };
    if (trainingStatus === TrainingStatus.OVERDUE) {
      searchCriteria.dueOnBefore = moment().endOf("day").toISOString();
    } else {
      searchCriteria.dueOnAfter = moment().toISOString();
      searchCriteria.dueOnBefore = moment()
        .add(7, "d")
        .startOf("day")
        .toISOString();
    }
    dispatch(
      tableSearchActions.setSearchCriteria(
        { queryDict: searchCriteria },
        "training"
      )
    );
  };
  return (
    <>
      <StyledListItem button onMouseEnter={onMouseHoverItemListItem}>
        <ListItemIcon className={classes.listItemIcon}>
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
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={`${classes.typography} ${classes.margin5}`}
                    color="textPrimary"
                    noWrap
                  >
                    <Text
                      translation="training.on"
                    />
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <Link
                    href={TRAINING_URL}
                    color="inherit"
                    className={classes.link}
                    onClick={setTrainingSearchCriteria}
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
                    href={TRAINING_URL}
                    color="inherit"
                    className={classes.link}
                    onClick={setTrainingSearchCriteria}
                  >
                    <Typography
                      component="span"
                      variant="caption"
                      className={`${classes.typographyBold} ${classes.margin5}`}
                      color="textSecondary"
                      noWrap
                    >
                      {docRevName} {docRevVersion}
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
                        label={
                          trainingStatus === TrainingStatus.OVERDUE
                            ? TrainingStatus.OVERDUE
                            : TrainingStatus.DUE_IN_7_DAYS
                        }
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
                        label={
                          trainingStatus === TrainingStatus.OVERDUE
                            ? TrainingStatus.OVERDUE
                            : TrainingStatus.DUE_IN_7_DAYS
                        }
                      />
                    )}
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
                  <StyledTooltip
                    title={
                      <Typography color="inherit">
                        <Text
                          translation="training.users.count"
                          values={{
                            count: size(pendingTrainees), status: trainingStatus === TrainingStatus.OVERDUE
                              ? TrainingStatus.OVERDUE
                              : TrainingStatus.DUE_IN_7_DAYS,
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
        {hoverItem && !pinned && (
          <Box component="div" className={classes.actionIcons}>
            {!pinHover && <PinIcon onMouseEnter={onMouseHoverPinIcon} />}
            {pinHover && (
              <StyledTooltip title={<Typography><Text translation="common.pin" /></Typography>} placement="top" arrow>
                <PinSolidIcon
                  onClick={handlePinClick}
                  onMouseLeave={onMouseLeavePinIcon}
                />
              </StyledTooltip>
            )}
          </Box>
        )}
        {pinned && (
          <StyledTooltip title={<Typography><Text translation="common.unpin" /></Typography>} placement="top" arrow>
            <PinSolidIcon
              onClick={handleUnPinClick}
            />
          </StyledTooltip>
        )}
      </StyledListItem>
      <Modal
        open={emailModelopen}
        onClose={onClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <TrainingEmailModal
          id={id}
          handleEmailModelClose={onClose}
          pendingTrainees={pendingTrainees}
          setLastEmailSent={setLastEmailSent}
          isOverDue={trainingStatus === TrainingStatus.OVERDUE}
          pendingEmailSentAt={pendingEmailSentAt}
        />
      </Modal>
    </>
  );
};

export default React.memo(PendingTrainingPresenter);
