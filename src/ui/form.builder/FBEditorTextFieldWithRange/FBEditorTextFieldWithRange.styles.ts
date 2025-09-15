import { makeStyles } from '@material-ui/core/styles';

const ADORNMENT_MARGIN = 5;

export default makeStyles(theme => ({
  toleranceField: {
    margin: theme.spacing(0, 0, 0, ADORNMENT_MARGIN),
  },
  toleranceAdornment: {
    position: 'relative',
    padding: 0,
    marginLeft: theme.spacing(-ADORNMENT_MARGIN - 1),
  },
}));
