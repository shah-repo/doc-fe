import { createStyles, makeStyles } from '@material-ui/core';

export default makeStyles((theme) =>
  createStyles({
    inputRoot: {
      padding: '2px 58px 2px 4px !important',
      minHeight: 0,
    },
    input: {
      padding: '8px !important',
    },
    endAdornment: {
      paddingRight: 0,
    },
  }),
);
