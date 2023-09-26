import { createStyles, makeStyles } from '@material-ui/core';

export default makeStyles((theme) =>
  createStyles({
    tooltipContainer: {
      marinLeft: theme.spacing(0.5),
      marginTop: theme.spacing(-0.4),
      cursor: 'pointer',
    },
  }),
);
