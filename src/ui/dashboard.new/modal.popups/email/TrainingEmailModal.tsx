import {
  Avatar,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItemText,
  Modal,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useIntl } from 'react-intl';
import { ReactComponent as ExpandIcon } from '../../../../assets/images/arrow_down.svg';
import { ReactComponent as CollapseIcon } from '../../../../assets/images/arrow_up.svg';
import { ReactComponent as EmailSuccessIcon } from '../../../../assets/images/email_success.svg';
import { ReactComponent as ModelCloseIcon } from '../../../../assets/images/model_close.svg';
import {
  getFormattedDateString,
  MomentFormats,
} from '../../../../common/utils/date';
import { Nullable } from '../../../../state/ducks/common/types';
import { emailAllActions } from '../../../../state/ducks/email.all';
import { getInitalsFromName } from '../../../components/icons/avatar/helpers';
import { toastError } from '../../../components/notifications';
import Text from '../../../components/Text';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { StyledListItem } from './StyledListItem';
import { styles } from './TrainingEmailModal.styles';

interface TrainingEmailModalProps {
  id: string
  handleEmailModelClose: () => void
  pendingTrainees?: any
  timestamp?: string | undefined
  pendingEmailSentAt: Nullable<string>
  setLastEmailSent: (flag: boolean) => void
  isOverDue?: boolean
}

const TrainingEmailModal: React.FunctionComponent<TrainingEmailModalProps> = ({
  id,
  handleEmailModelClose,
  pendingTrainees,
  isOverDue,
  pendingEmailSentAt,
  setLastEmailSent,
}) => {
  const classes = styles();
  const [apiAlertModelOpen, setApiAlertModel] = React.useState(false);
  const [openOverdue, setOpenOverdue] = React.useState(true);
  const [emailSuccess, setEmailSuccess] = React.useState(false);

  const handleClickOverdue = () => {
    setOpenOverdue(!openOverdue);
  };

  const handleApiAlertModelOpen = () => {
    setApiAlertModel(true);
    setTimeout(() => {
      handleEmailSuccess();
    }, 2000);
  };

  const handleApiAlertModelClose = () => {
    setApiAlertModel(false);
  };

  const handleEmailSuccess = () => {
    setEmailSuccess(true);
  };
  const intl = useIntl();
  const sendDueTrainingEmail = useActionCreator(emailAllActions.sendDueTrainingEmail);

  const async = useAsync({
    onSuccess: () => {
      handleApiAlertModelOpen();
    },
    onError: () => {
      toastError(intl.formatMessage({ id: 'common.falied.email' }));
    },
  });

  const handleSendEmail = () => {
    setLastEmailSent(true);
    async.start(sendDueTrainingEmail, id, async);
  };

  const apiAlertModelbody = (
    <Box className={classes.emailPaper}>
      <Grid container justify="space-between">
        <Grid item>
          <Typography
            variant="h2"
            component="h2"
            id="simple-modal-title"
            className={classes.modeltitle}
          >
            <Text translation="training.email.title" />
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="close"
            className={classes.closemodel}
            onClick={handleApiAlertModelClose}
          >
            <ModelCloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.confroot}
      >
        <Grid item>
          <Typography
            variant="h2"
            component="h2"
            id="simple-modal-title"
            className={classes.confmesg}
          >
            <EmailSuccessIcon className={classes.successIcon} />
            <Text translation="training.email.success.message" />
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="h2"
            component="h2"
            id="simple-modal-title"
            className={classes.confmesgdate}
          >
            <Text translation="common.sent" />:&nbsp;
            {getFormattedDateString(undefined, MomentFormats.BriefDate)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
  return (
    <Box component="div" className={classes.paper}>
      <Grid container justify="space-between">
        <Grid item>
          <Typography
            variant="h2"
            component="h2"
            id="simple-modal-title"
            className={classes.modeltitle}
          >
            <Text translation="training.modal.title" />
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="close"
            className={classes.closemodel}
            onClick={handleEmailModelClose}
          >
            <ModelCloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Box component="div" className={classes.dueBox}>
        <StyledListItem button>
          {openOverdue ? (
            <CollapseIcon
              className={classes.iconupdown}
              onClick={handleClickOverdue}
            />
          ) : (
            <ExpandIcon
              className={classes.iconupdown}
              onClick={handleClickOverdue}
            />
          )}
          <ListItemText
            primary={
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography
                    variant="h2"
                    component="h2"
                    className={
                      isOverDue ? classes.overduetitle : classes.duetitle
                    }
                    noWrap
                  >
                    {isOverDue && (
                      <span style={{ textTransform: 'uppercase' }}>
                        <Text translation="common.overdue" />
                      </span>
                    )}
                    {!isOverDue && <Text translation="common.duein7days" />}
                    {' '}({pendingTrainees?.length || 0})
                  </Typography>
                </Grid>
                {emailSuccess ? (
                  <Grid item>
                    <Typography
                      variant="h2"
                      component="h2"
                      className={classes.lastsenttext}
                      noWrap
                    >
                      <Text translation="common.just.now" />
                    </Typography>
                  </Grid>
                ) : (
                  <>
                    <Grid item>
                      {pendingEmailSentAt !== null && (
                        <Typography
                          variant="inherit"
                          component="inherit"
                          className={classes.lastsenttext}
                          noWrap
                        >
                          <Text translation="email.last.sent" />:&nbsp;
                          {getFormattedDateString(
                            pendingEmailSentAt,
                            MomentFormats.BriefDate,
                          )}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={() => handleSendEmail()}
                        data-cy="email-button"
                        className={classes.emailbutton}
                      >
                        <Text translation="email.button.title" />
                      </Button>
                      <Modal
                        open={apiAlertModelOpen}
                        onClose={handleApiAlertModelClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                      >
                        {apiAlertModelbody}
                      </Modal>
                    </Grid>
                  </>
                )}
              </Grid>
            }
          />
        </StyledListItem>
        <Collapse
          in={openOverdue}
          timeout="auto"
          unmountOnExit
          className={classes.listrootdue}
        >
          <List dense disablePadding>
            {pendingTrainees?.map((due, index) => (
              <StyledListItem button key={index}>
                {due.userAvatar
                  ? <Avatar className={classes.listitemicon} alt={due.userName} src={due.userAvatar} />
                  : <Avatar className={classes.listitemicon} style={{ backgroundColor: due.userInitialColor }}>
                    {getInitalsFromName(due.userName)}
                  </Avatar>
                }
                <ListItemText
                  id={due.employeeId}
                  primary={
                    <Typography
                      component="span"
                      variant="h2"
                      data-cy="list-item-text"
                      className={classes.listitemtext}
                    >
                      {due.userName}
                    </Typography>
                  }
                />
              </StyledListItem>
            ))}
          </List>
        </Collapse>
      </Box>
    </Box>
  );
};
export default TrainingEmailModal;
