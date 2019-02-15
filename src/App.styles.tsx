import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

export default (theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      paddingTop: theme.spacing.unit * 20,
    },
  });
