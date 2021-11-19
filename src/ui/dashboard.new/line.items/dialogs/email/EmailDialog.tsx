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
} from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { ReactComponent as ExpandIcon } from "../../../../../assets/images/arrow_down.svg";
import { ReactComponent as CollapseIcon } from "../../../../../assets/images/arrow_up.svg";
import { ReactComponent as EmailSuccessIcon } from "../../../../../assets/images/email_success.svg";
import { ReactComponent as ModelCloseIcon } from "../../../../../assets/images/model_close.svg";
import { getFormattedDateString, MomentFormats } from "../../../../../common/utils/date";
import { Nullable } from "../../../../../state/ducks/common/types";
import { emailAllActions } from "../../../../../state/ducks/email.all";
import { toastError } from "../../../../components/notifications";
import Text from "../../../../components/Text";
import useActionCreator from "../../../../hooks/useActionCreator";
import useAsync from "../../../../hooks/useAsync";
import { styles } from "./EmailModal.styles";
import { StyledListItem } from "./StyledListItem";

interface EmailModalProps {
  id: string;
  handleEmailModelClose: () => void;
  pendingApprovers: {
    userName: string;
    employeeId: string;
    userAvatar: Nullable<string>;
    userInitialColor: string;
    approvalStatus: string;
  }[];
  timestamp?: string;
  approvedApprovers: {
    userName: string;
    employeeId: string;
    userAvatar: Nullable<string>;
    userInitialColor: string;
    approvalStatus: string;
  }[];
}

const EmailModal: React.FunctionComponent<EmailModalProps> = ({
  id,
  handleEmailModelClose,
  pendingApprovers,
  timestamp,
  approvedApprovers,
}) => {
  const classes = styles();
  const [apiAlertModelOpen, setApiAlertModel] = React.useState(false);
  const [openPending, setOpenPending] = React.useState(true);
  const [openApproved, setOpenApproved] = React.useState(false);

  const handleClickPending = () => {
    setOpenPending(!openPending);
  };

  const handleClickApproved = () => {
    setOpenApproved(!openApproved);
  };

  const handleApiAlertModelOpen = () => {
    setApiAlertModel(true);
    setTimeout(() => {
      handleEmailModelClose();
    }, 2000);
  };

  const handleApiAlertModelClose = () => {
    setApiAlertModel(false);
  };

  const intl = useIntl();
  const sendEmail = useActionCreator(emailAllActions.sendEmail);

  const async = useAsync({
    onSuccess: () => {
      handleApiAlertModelOpen();
    },
    onError: () => {
      toastError(intl.formatMessage({ id: "common.falied.email" }));
    },
  });

  const handleSendEmail = () => {
    async.start(sendEmail, id, async);
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
            <Text translation="email.title" />
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
            <Text translation="email.success.message" />
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            variant="h2"
            component="h2"
            id="simple-modal-title"
            className={classes.confmesgdate}
          >
            <Text translation="common.sent" />:{" "}
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
            <Text translation="modal.title" />
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
      <Box component="div" className={classes.pendingBox}>
        <StyledListItem button>
          {openPending ? (
            <CollapseIcon
              className={classes.iconupdown}
              onClick={handleClickPending}
            />
          ) : (
            <ExpandIcon
              className={classes.iconupdown}
              onClick={handleClickPending}
            />
          )}
          <ListItemText
            primary={
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography
                    variant="h2"
                    component="h2"
                    className={classes.pendingtitle}
                    noWrap
                  >
                    <Text translation="modal.title.pending" />
                    {` `}({pendingApprovers?.length})
                  </Typography>
                </Grid>
                {/* <Grid item>
                  <Typography
                    variant="h2"
                    component="h2"
                    className={classes.lastseentitle}
                    noWrap
                  >
                    <Text translation="email.last.sent" />:{" "}
                    {getFormattedDateString(timestamp, MomentFormats.BriefDate)}
                  </Typography>
                </Grid> */}
                <Grid item>
                  <Button
                    onClick={() => handleSendEmail()}
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
              </Grid>
            }
          />
        </StyledListItem>
        <Collapse
          in={openPending}
          timeout="auto"
          unmountOnExit
          className={classes.listrootpending}
        >
          <List dense disablePadding>
            {pendingApprovers.map((pending, index) => (
              <StyledListItem button key={index}>
                <Avatar
                  style={{ backgroundColor: `${pending.userInitialColor}` }}
                  className={classes.listitemicon}
                  alt={pending.userName}
                  src={pending.userAvatar || "."}
                />
                <ListItemText
                  id={pending.employeeId}
                  primary={
                    <Typography
                      component="span"
                      variant="h2"
                      className={classes.listitemtext}
                    >
                      {pending.userName}
                    </Typography>
                  }
                />
              </StyledListItem>
            ))}
          </List>
        </Collapse>
      </Box>
      <Box component="div" className={classes.approvedBox}>
        <StyledListItem button>
          {openApproved ? (
            <CollapseIcon
              className={classes.iconupdown}
              onClick={handleClickApproved}
            />
          ) : (
            <ExpandIcon
              className={classes.iconupdown}
              onClick={handleClickApproved}
            />
          )}
          <ListItemText
            primary={
              <Grid container justify="flex-start">
                <Grid item>
                  <Typography
                    variant="h2"
                    component="h2"
                    className={classes.approvedtitle}
                    noWrap
                  >
                    <Text translation="modal.title.approved" />
                    {` `}({approvedApprovers?.length || 0})
                  </Typography>
                </Grid>
              </Grid>
            }
          />
        </StyledListItem>
        <Collapse
          in={openApproved}
          timeout="auto"
          unmountOnExit
          className={classes.listrootapproved}
        >
          <List dense disablePadding>
            {approvedApprovers?.map((approved, index) => (
              <StyledListItem button key={index}>
                <Avatar
                  style={{ backgroundColor: `${approved.userInitialColor}` }}
                  className={classes.listitemicon}
                  alt={approved.userName}
                  src={approved.userAvatar || "."}
                />
                <ListItemText
                  id={approved.employeeId}
                  primary={
                    <Typography
                      component="span"
                      variant="h2"
                      className={classes.listitemtext}
                    >
                      {approved.userName}
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
export default EmailModal;
