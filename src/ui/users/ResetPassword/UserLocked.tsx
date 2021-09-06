import { Box, Link, Paper, Typography } from "@material-ui/core";
import React from "react";
import { logo } from "../../../common/utils/helpers";
import { styles } from "./ResetPasswordSuccessful.styles";


const UserLocked: React.FunctionComponent<{}> = () => {
  const classes = styles();

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <img
          src={logo}
          alt="Logo"
          className={classes.logo}
        />
        <Box display="flex" textAlign="center" mb={5} data-cy="UserLocked-lockedInfo">
          <Typography variant="h5"className={classes.lockedInfo}>
            Your account has been locked.
          </Typography>
        </Box>
        <Box display="flex" textAlign="center" mb={5} data-cy="UserLocked-infoLink">
          <Typography variant="h5"className={classes.lockedInfo}>
            Please reach out to your company admin or contact &nbsp;
            <Link href={"mailto:enlil-feedback@shifamed.com"} variant="h1" className={classes.link}>
              enlil-feedback@shifamed.com
            </Link>
            &nbsp; to reset your password.
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default UserLocked;
