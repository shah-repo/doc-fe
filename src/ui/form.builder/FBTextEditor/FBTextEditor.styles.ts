import { createStyles, makeStyles } from '@material-ui/core';

export default makeStyles(() =>
  createStyles({
    marginBStyle: {
      '& p':
      { marginBottom: '0px' },
    },
  })
);
