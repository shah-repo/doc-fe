import { makeStyles } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles((theme) => ({
  input: {
    '&.MuiInputBase-root': {
      marginTop: 10,
      padding: 0,
    },
    '& .MuiInputBase-input': {
      padding: 10,
      fontSize: 14,
    },
    '& .MuiInputAdornment-positionStart': {
      marginLeft: 8,
      marginRight: -10,
    },
  },
  renderHtmlRoot: {
    marginBottom: theme.spacing(-2.5),
  },
  outlinedInput: {
    padding: '10px !important',
    paddingLeft: '0px !important',
    fontSize: '1rem !important',
    fontWeight: 400,
    color: Colors.black,
    paddingRight: '0px !important',
  },
  adornmentStart: {
    fontSize: 14,
    marginRight: '0px !important',
  },
}));
