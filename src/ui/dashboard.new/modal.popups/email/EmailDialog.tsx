import {
  Avatar,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as ExpandIcon } from "../../../../assets/images/arrow_down.svg";
import { ReactComponent as CollapseIcon } from "../../../../assets/images/arrow_up.svg";
import { ReactComponent as ModelCloseIcon } from "../../../../assets/images/model_close.svg";
import Colors from "../../../layout/theme/utils/colors";
import { styles } from "./EmailModal.styles";

interface EmailModalProps {
  handleEmailModelClose: () => void;
  pendingApprovers: any;
}

const EmailModal: React.FunctionComponent<EmailModalProps> = ({
  handleEmailModelClose,
  pendingApprovers,
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
      handleApiAlertModelClose();
    }, 3000);
  };

  const handleApiAlertModelClose = () => {
    setApiAlertModel(false);
  };

  const StyledListItem = withStyles({
    root: { "backgroundColor": Colors.white, "&:hover": {} },
  })(ListItem);

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
            Email Confirmation
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
            EMAIL SENT TO ALL
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
            Approval Status
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
        <StyledListItem button onClick={handleClickPending}>
          {openPending ? (
            <CollapseIcon className={classes.iconupdown} />
          ) : (
            <ExpandIcon className={classes.iconupdown} />
          )}
          <ListItemText
            primary={
              <>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography
                      variant="h2"
                      component="h2"
                      className={classes.pendingtitle}
                      noWrap
                    >
                      PENDING ({pendingApprovers?.length})
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={handleApiAlertModelOpen}
                      className={classes.emailbutton}
                    >
                      EMAIL ALL
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
              </>
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
                  className={classes.listitemicon}
                  alt={pending.userName}
                  src="."
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
        <StyledListItem button onClick={handleClickApproved}>
          {openApproved ? (
            <CollapseIcon className={classes.iconupdown} />
          ) : (
            <ExpandIcon className={classes.iconupdown} />
          )}
          <ListItemText
            primary={
              <>
                <Grid container justify="flex-start">
                  <Grid item>
                    <Typography
                      variant="h2"
                      component="h2"
                      className={classes.approvedtitle}
                      noWrap
                    >
                      {`APPROVED (0)`}
                    </Typography>
                  </Grid>
                </Grid>
              </>
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
            {pendingApprovers.map((pending, index) => (
              <StyledListItem button key={index}>
                <Avatar
                  className={classes.listitemicon}
                  alt={pending.userName}
                  src="."
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
    </Box>
  );
};
export default EmailModal;
