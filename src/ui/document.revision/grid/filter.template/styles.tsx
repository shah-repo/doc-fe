import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  statusDropDown: {
    width: '80%',
  },
  dropdownOption: {
    display: 'block',
    maxWidth: 180,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  multiSelectStatus: {
    display: 'inline-block',
    maxWidth: 120,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
  },
  singleLineTruncate: {
    display: 'block',
    minWidth: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));
