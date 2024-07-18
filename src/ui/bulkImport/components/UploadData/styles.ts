import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  container: {
    display: 'block',
    margin: '0 auto',
    maxWidth: 550,
    marginTop: theme.spacing(5.625),
  },
  titleContainer: {
    paddingBottom: theme.spacing(1.25),
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  sampleTemplate: {
    maxHeight: 36,
  },
}));
