import { createStyles, makeStyles } from '@material-ui/core';

export default makeStyles((theme) =>
  createStyles({
    inputRoot: {
      padding: `${theme.spacing(0.25, 7.25, 0.25, 0.5)} !important`,
      minHeight: 0,
    },
    input: {
      padding: `${theme.spacing(1)} !important`,
    },
    endAdornment: {
      paddingRight: 0,
    },
  }),
);
