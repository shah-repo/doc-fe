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
import { ReactComponent as ExpandIcon } from "../../../../assets/images/arrow_down.svg";
import { ReactComponent as CollapseIcon } from "../../../../assets/images/arrow_up.svg";
import { ReactComponent as EmailSuccessIcon } from "../../../../assets/images/email_success.svg";
import { ReactComponent as ModelCloseIcon } from "../../../../assets/images/model_close.svg";
import Text from "../../../components/Text";
import { StyledListItem } from "./StyledListItem";
import { styles } from "./TrainingEmailModal.styles";

interface TrainingEmailModalProps {
  handleEmailModelClose: () => void;
  dueApprovers?: any;
  overdueApprovers?: any;
}

const TrainingEmailModal: React.FunctionComponent<TrainingEmailModalProps> = ({
  handleEmailModelClose,
  dueApprovers,
  overdueApprovers,
}) => {
  const classes = styles();
  const [apiAlertModelOpen, setApiAlertModel] = React.useState(false);
  const [openOverdue, setOpenOverdue] = React.useState(true);
  const [openDue, setOpenDue] = React.useState(false);

  const handleClickOverdue = () => {
    setOpenOverdue(!openOverdue);
  };

  const handleClickDue = () => {
    setOpenDue(!openDue);
  };

  const handleApiAlertModelOpen = () => {
    setApiAlertModel(true);
    setTimeout(() => {
      handleApiAlertModelClose();
    }, 1000);
  };

  const handleApiAlertModelClose = () => {
    setApiAlertModel(false);
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
            Sent: 10/5/21
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
                    className={classes.overduetitle}
                    noWrap
                  >
                    <Text translation="modal.title.overdue" />
                    {` `}({overdueApprovers?.length || 0})
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h2"
                    component="h2"
                    className={classes.lastseentitle}
                    noWrap
                  >
                    <Text translation="email.last.sent" />: Oct 08, 2021
                  </Typography>
                </Grid>

                <Grid item>
                  <Button
                    onClick={handleApiAlertModelOpen}
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
          in={openOverdue}
          timeout="auto"
          unmountOnExit
          className={classes.listrootdue}
        >
          <List dense disablePadding>
            {overdueApprovers?.map((due, index) => (
              <StyledListItem button key={index}>
                <Avatar
                  className={classes.listitemicon}
                  alt={due.userName}
                  src="."
                />
                <ListItemText
                  id={due.employeeId}
                  primary={
                    <Typography
                      component="span"
                      variant="h2"
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
      <Box component="div" className={classes.duesoonBox}>
        <StyledListItem button>
          {openDue ? (
            <CollapseIcon
              className={classes.iconupdown}
              onClick={handleClickDue}
            />
          ) : (
            <ExpandIcon
              className={classes.iconupdown}
              onClick={handleClickDue}
            />
          )}
          <ListItemText
            primary={
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography
                    variant="h2"
                    component="h2"
                    className={classes.duetitle}
                    noWrap
                  >
                    <Text translation="modal.title.dueindays" />
                    {` `}({dueApprovers?.length || 0})
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleApiAlertModelOpen}
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
          in={openDue}
          timeout="auto"
          unmountOnExit
          className={classes.listrootduesoon}
        >
          <List dense disablePadding>
            {dueApprovers.map((due, index) => (
              <StyledListItem button key={index}>
                <Avatar
                  className={classes.listitemicon}
                  alt={due.userName}
                  src="."
                />
                <ListItemText
                  id={due.employeeId}
                  primary={
                    <Typography
                      component="span"
                      variant="h2"
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
