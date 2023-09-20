import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1, 2, 1, 1),
      marginTop: theme.spacing(0.5),
      backgroundColor: Colors.white,
      boxShadow: `4px 4px 8px 4px ${Colors.blue_bell}`,
      right: theme.spacing(1.25),
      maxWidth: 'fit-content',
    },
    link: {
      color: Colors.navy,
    },
    table: {
      width: '100%',
    },
    heading: {
      color: Colors.dark_gray,
    },
  }),
);
