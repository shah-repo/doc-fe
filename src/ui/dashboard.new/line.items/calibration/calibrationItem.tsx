import { Box, Grid, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { ReactComponent as EQIcon } from '../../../../assets/images/EQ.svg';
import { ReactComponent as PinIcon } from '../../../../assets/images/pin.svg';
import { ReactComponent as PinSolidIcon } from '../../../../assets/images/pin_solid.svg';
import { ActionTypes } from '../../../../state/ducks/dashboard.new/my.feeds/types';
import Text from '../../../components/Text';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import DocId from '../common/DocId/presenter';
import DocTitle from '../common/DocTitle/presenter';
import { StyledListItem } from '../common/StyledListItem';
import { StyleTooltip } from '../common/StyleTooltip';
import useStyles from './calibrationItem.styles';
import DismissAction from '../common/DismissAction';

interface Props {
  id: string;
  docId: string;
  docDocumentId: string;
  type: ActionTypes;
  docRevName: string;
  docRevVersion: string;
  docRevId: string;
  docRevOwnerId: string;
  equipmentInterval: number;
  dueOn?: string;
  timestamp?: string;
  hoverItemId: string;
  onMouseHoverItem: (id: string) => void;
  pinned: boolean;
  pinLineItem?: (id: string) => void;
  unPinLineItem?: (id: string) => void;
  dismissLineItem?: (id: string) => void;
}
const TaskApprovalPresenter: React.FC<Props> = ({
  id,
  docDocumentId,
  docId,
  type,
  docRevId,
  docRevName,
  docRevVersion,
  dueOn,
  timestamp,
  hoverItemId,
  equipmentInterval,
  onMouseHoverItem,
  pinned,
  pinLineItem,
  unPinLineItem,
  dismissLineItem,
}) => {
  const classes = useStyles();
  const [pinHover, setPinHover] = React.useState(false);
  const hoverItem = hoverItemId === id;
  const handlePinClick = () => {
    pinLineItem?.(id);
  };
  const handleUnPinClick = () => {
    unPinLineItem?.(id);
  };
  const handleDismiss = () => {
    dismissLineItem?.(id);
  };
  const onMouseLeaveActionIcons = () => {
    setPinHover(false);
  };
  const onMouseHoverListItem = () => {
    onMouseHoverItem(id);
  };
  const onMouseHoverPinIcon = () => {
    setPinHover(true);
  };

  const isPinShown = pinLineItem && !pinned;
  const isUnpinShown = unPinLineItem && pinned;

  return (
    <StyledListItem
      button
      divider
      disableRipple
      className={classes.buttoncursor}
      onMouseEnter={onMouseHoverListItem}
    >
      <ListItemIcon>
        <EQIcon height={30} width={30} />
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
                <DocId
                  url={docId ? documentVersionPath(docRevId || '', docDocumentId) : '#'}
                  docId={docId}
                />
              </Grid>
              <Grid zeroMinWidth item={true} className={classes.truncateText}>
                <DocTitle
                  url={docRevId ? documentVersionPath(docRevId || '', docDocumentId) : '#'}
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
                  <Text
                    translation={
                      type === ActionTypes.EQ_CALIBRATION_OWNER_OR_COORDINATOR
                        ? 'dashboard.calibration.due'
                        : 'dashboard.preventive.maintenance.due'
                    }
                    values={{
                      noOfDays: equipmentInterval,
                    }}
                  />
                </Typography>
              </Grid>
              <Grid item={true} className={classes.grayDot}></Grid>
              <Grid item={true}>
                <Typography
                  component="span"
                  variant="caption"
                  className={classes.dueOn}
                  color="textSecondary"
                  noWrap
                >
                  {dueOn}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container={true}
              wrap="nowrap"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item={true} className={classes.grayDot}></Grid>
              <Grid item={true} md={12} sm={12}>
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
      {hoverItem && isPinShown && (
        <Box
          component="div"
          className={classes.actionIcons}
          onMouseLeave={onMouseLeaveActionIcons}
        >
          <span className={classes.actionIcon}>
            {!pinHover && !pinned && (
              <PinIcon
                data-cy="pin-icon"
                onMouseEnter={onMouseHoverPinIcon}
                className={classes.cursorPointer}
              />
            )}
            {pinHover && !pinned && (
              <StyleTooltip
                title={<Text translation="common.pin" />}
                placement="top"
                arrow
              >
                <PinSolidIcon
                  data-cy="pin-solid-icon"
                  onClick={handlePinClick}
                  onMouseLeave={onMouseLeaveActionIcons}
                  className={classes.cursorPointer}
                />
              </StyleTooltip>
            )}
          </span>
          {dismissLineItem && (
            <DismissAction classes={classes} onClick={handleDismiss} />
          )}
        </Box>
      )}
      {isUnpinShown && (
        <span className={classes.actionIcon}>
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
        </span>
      )}
      {hoverItem && dismissLineItem && (
        <DismissAction classes={classes} onClick={handleDismiss} />
      )}
    </StyledListItem>
  );
};

export default TaskApprovalPresenter;
