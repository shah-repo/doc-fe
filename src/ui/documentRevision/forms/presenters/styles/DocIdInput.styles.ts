import { makeStyles } from '@material-ui/core';

export const styles = makeStyles((theme) => ({
  input: {
    '&.MuiInputBase-root': {
      marginTop: 10,
      padding: 0,
    },
    '& .MuiInputBase-input': {
      padding: 10,
      fontSize: 14,
    },
  },
  renderHtmlRoot: {
    marginBottom: theme.spacing(-2.5),
  },
}));
