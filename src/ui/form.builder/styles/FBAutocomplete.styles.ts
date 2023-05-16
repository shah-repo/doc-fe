import { createStyles, makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export const styles = {
  inputPropStyle: {
    minHeight: 40,
    borderRadius: 3,
    padding: '0 80px 0 6px',
  },
  labelProps: {
    marginBottom: 10,
    fontWeight: 600,
    fontSize: 12,
    color: Colors.almost_black,
  },
  labelStyle: {
    fontWeight: 600,
    fontSize: 12,
    color: Colors.almost_black,
  },
  labelFont: {
    fontSize: 14,
  },
};


export const FBAutoCompleteStyle = makeStyles(() =>
  createStyles({
    root: {
      '& .MuiAutocomplete-inputRoot': {
        height: 40,
        padding: 0,
      },
      '& input': {
        minHeight: 'initial !important',
        fontSize: '12px',
        color: Colors.almost_black,
      },
    },
  })
);
