import { AppBar, Box, IconButton, TextField, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { isEmpty } from "lodash";
import React from "react";
import { EmployeeEditRequestBody } from "../../../../state/ducks/auth";
import Text from "../../../components/Text";
import styles from "../UserProfile.styles";
interface OwnProps {
  close: () => void;
  showEditUser: boolean;
  name: string;
  userInfo: EmployeeEditRequestBody;
  setUserInfo: (values: EmployeeEditRequestBody) => void;
  setUsernameError: (value: boolean) => void;
  isUsernameEmpty: boolean;
}

type Props = OwnProps;

const DialogTitle: React.FunctionComponent<Props> = ({
  close,
  showEditUser,
  name,
  userInfo,
  setUserInfo,
  setUsernameError,
  isUsernameEmpty,
}) => {
  const classes = styles();

  const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
    if (isEmpty(event.target.value)) {
      setUsernameError(true);
      return;
    }
    setUserInfo({ ...userInfo, name: event.target.value });
    setUsernameError(false);
  };

  const userNameRenderer = (name: string) => (
    <Typography variant="h3" className={classes.userName} id="DialogTitle-name">
      {name}
    </Typography>
  );

  const editUserNameRenderer = (name: string) => (
    <TextField
      error={isUsernameEmpty}
      defaultValue={name}
      onChange={handleNameChange}
      className={classes.userNameEdit}
      id="DialogTitle-nameEdit"
      helperText={isUsernameEmpty ? <Text translation="validator.user.name.required"/> : ""}
    />
  );
  return (
    <AppBar classes={{ positionFixed: classes.positionFixed }} className={classes.appBar}>
      <Toolbar>
        <IconButton
          className={classes.iconButton}
          onClick={close}
          aria-label="Close"
          id="DialogContent-close"
        >
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Box display="block" textAlign="center">
        <Typography variant="h4" className={classes.userProfile}>
          <Text translation="user.management.profile" />
        </Typography>
        {!showEditUser && userNameRenderer(name)}
        {showEditUser && editUserNameRenderer(name)}
      </Box>
    </AppBar>
  );
};

export default DialogTitle;
