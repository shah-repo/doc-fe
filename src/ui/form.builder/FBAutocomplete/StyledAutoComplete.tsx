import { Chip, withStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

export const StyledAutoComplete = withStyles((theme) => ({
  endAdornment: {
    'paddingRight': '28px',
    '& .MuiAutocomplete-popupIndicator.Mui-disabled': {
      display: 'none',
    },
  },
}))(Autocomplete);

export const StyledPopupAutoComplete = withStyles((theme) => ({
  endAdornment: {
    paddingRight: '5px',
  },
}))(Autocomplete);

export const StyledChip = withStyles((theme) => ({
  label: {
    padding: '5px 8px',
  },
}))(Chip);
