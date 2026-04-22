import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1.875),
  },
  labelRow: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

export default useStyles;
