import { Box, Grid, Link, ListItemIcon, ListItemText, Modal, Typography } from '@material-ui/core';
import { size } from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { ReactComponent as OverdueIcon } from '../../../../../assets/images/overdue_status.svg';
import { ReactComponent as OverdueWhiteIcon } from '../../../../../assets/images/overdue_status_white.svg';
import { ReactComponent as PinIcon } from '../../../../../assets/images/pin.svg';
import { ReactComponent as PinSolidIcon } from '../../../../../assets/images/pin_solid.svg';
import { ReactComponent as TrainingIcon } from '../../../../../assets/images/training.svg';
import { ReactComponent as WarningIcon } from '../../../../../assets/images/warning_status.svg';
import { ReactComponent as WarningWhiteIcon } from '../../../../../assets/images/warning_status_white.svg';
import { Nullable } from '../../../../../state/ducks/common/types';
import { trainingActions } from '../../../../../state/ducks/dashboard.new/training';
import { TrainingStatus } from '../../../../../state/ducks/dashboard/types';
import { tableSearchActions } from '../../../../../state/ducks/tableSearch';
import Text from '../../../../components/Text';
import { TRAINING_URL } from '../../../../constants/urls';
import { CompletedOnDateOptions } from '../../../../document.revision/utils/types';
import gridConfiguration from '../../../../training/grid/column.definition';
import { TRAINING_TABLE_NAME } from '../../../../training/grid/container';
import { DateFields } from '../../../../training/kendo/types';
import { Translation } from '../../../../translations/types';
import TrainingEmailModal from '../../../modal.popups/email/TrainingEmailModal';
import { HoverStyleChip } from '../../common/HoverStyleChip';
import { NormalStyleChip } from '../../common/NormalStyleChip';
import { StyledListItem } from '../../common/StyledListItem';
import { StyleTooltip } from '../../common/StyleTooltip';
import useStyles from './newTraining.styles';

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
  const classes = useStyles();
  const dispatch = useDispatch();
  const [pinHover, setPinHover] = React.useState(false);
  const [emailModelopen, setEmailModelopen] = React.useState(false);
  const [lastEmailSent, setLastEmailSent] = React.useState(false);
  const hoverItem = hoverItemId === id;
  const count = size(pendingTrainees);
  const translationField = count > 1 ? 'training.users.counts' : 'training.users.count';
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
      dispatch(trainingActions.loadTrainingList({}));
    }
  };
  const pendingTraineesNames = pendingTrainees
    .map((trainee) => trainee.userName)
    .join(', ');
  const setTrainingSearchCriteria = () => {
    let filterDate = {};
    if (trainingStatus === TrainingStatus.OVERDUE) {
      filterDate = {
        operator: 'eq',
        value: CompletedOnDateOptions.OVERDUE,
        field: DateFields.DUE_ON,
      };
    } else {
      filterDate = {
        operator: 'eq',
        value: CompletedOnDateOptions.NEXT_WEEK,
        field: DateFields.DUE_ON,
      };
    }
    const filterKendoConfig = {
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'documentRevision.name',
            operator: 'eq',
            value: docRevName,
          },
          {
            field: 'documentRevision.displayRevision',
            operator: 'eq',
            value: docRevVersion,
          },
          {
            field: 'trainingPlan.document.docId',
            operator: 'eq',
            value: docId,
          },
          {
            ...filterDate,
          },
        ],
      },
      sort: [
        {
          field: 'trId',
          dir: 'asc',
        },
      ],
      skip: 0,
      take: 25,
      group: [],
    };
    dispatch(
      tableSearchActions.setSearchCriteria(
        {
          apiError: '',
          scrollToIndex: 0,
          forceUpdate: false,
          queryDict: {
            dataState: filterKendoConfig,
          },
          columnConfig: JSON.stringify(gridConfiguration.columns),
        },
        TRAINING_TABLE_NAME
      )
    );
  };
  return (
    <>
      <StyledListItem button onMouseEnter={onMouseHoverItemListItem} className={classes.buttoncursor} disableRipple>
        <ListItemIcon className={classes.actionIcon}>
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
                    <Text translation="training.on" />
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <RouterLink
                    to={TRAINING_URL}
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
                  </RouterLink>
                </Grid>
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <StyleTooltip
                    title={
                      <>
                        <Text translation="dashboard.revision" />
                        &nbsp;{docRevVersion} {docRevName}
                      </>
                    }
                    placement="top-start"
                    arrow
                    PopperProps={{ popperOptions: {} }}
                  >
                    <RouterLink
                      to={TRAINING_URL}
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
                        <Text translation="dashboard.revision" />
                        &nbsp;{docRevVersion} {docRevName}
                      </Typography>
                    </RouterLink>
                  </StyleTooltip>
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
                  <StyleTooltip
                    title={
                      <>
                        <Text
                          translation={translationField as Translation}
                          values={{
                            count,
                            status:
                              trainingStatus === TrainingStatus.OVERDUE
                                ? TrainingStatus.OVERDUE
                                : TrainingStatus.DUE_IN_7_DAYS,
                          }}
                        />
                      </>
                    }
                    placement="top-start"
                    arrow
                    PopperProps={{ popperOptions: {} }}
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
                  </StyleTooltip>
                </Grid>
                <Grid
                  item={true}
                  className={`${classes.grayDot} ${classes.margin7}`}
                ></Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={
                      pinned || hoverItem
                        ? `${classes.timestampContainer} ${classes.marginRight}`
                        : classes.timestampContainer
                    }
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
            {!pinHover && (
              <PinIcon
                data-cy="pin-icon"
                onMouseEnter={onMouseHoverPinIcon}
                className={classes.cursorPointer}
              />
            )}
            {pinHover && (
              <StyleTooltip
                title={<Text translation="common.pin" />}
                placement="top"
                arrow
              >
                <PinSolidIcon
                  data-cy="pin-solid-icon"
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
              <PinSolidIcon
                data-cy="pin-solid-icon"
                onClick={handleUnPinClick}
                className={classes.cursorPointer}
              />
            </StyleTooltip>
          </Box>
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
