import { AppBar, Box, IconButton, TextField, Toolbar, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { isEmpty } from 'lodash';
import React from 'react';
import { EmployeeEditRequestBody } from '../../../../state/ducks/auth/types';
import Text from '../../../components/Text';
import styles from '../UserProfile.styles';
import { Translation } from '../../../translations/types';

const MAX_NAME_LENGTH = 100;

interface Props {
  close: () => void
  showEditUser: boolean
  name: string
  userInfo: EmployeeEditRequestBody
  setUserInfo: (values: EmployeeEditRequestBody) => void
  setUsernameError: (value: Translation | null) => void
  usernameError: Translation | null
}

const DialogTitle: React.FunctionComponent<Props> = ({
  close,
  showEditUser,
  name,
  userInfo,
  setUserInfo,
  setUsernameError,
  usernameError,
}) => {
  const classes = styles();

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;

    if (isEmpty(value)) {
      return setUsernameError('validator.user.name.required');
    }

    if (value.length > MAX_NAME_LENGTH) {
      return setUsernameError('validator.user.name.length');
    }

    setUserInfo({ ...userInfo, name: value });
    setUsernameError(null);
  };

  const userNameRenderer = (name: string) => (
    <Typography variant="h3" className={classes.userName} id="DialogTitle-name">
      {name}
    </Typography>
  );

  const editUserNameRenderer = (name: string) => (
    <TextField
      error={Boolean(usernameError)}
      defaultValue={name}
      onChange={handleNameChange}
      className={classes.userNameEdit}
      id="DialogTitle-nameEdit"
      helperText={usernameError && <Text translation={usernameError} />}
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
