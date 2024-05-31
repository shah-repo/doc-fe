import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  container: {
    display: 'block',
    margin: '0 auto',
    maxWidth: 550,
    marginTop: 45,
  },
  titleContainer: {
    paddingBottom: 10,
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
