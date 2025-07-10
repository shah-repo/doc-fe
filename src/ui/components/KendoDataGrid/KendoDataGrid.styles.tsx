import { makeStyles } from '@material-ui/core';

const KendoDataGridStyles = makeStyles((theme) => ({
  customHeaderCell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
}));
export default KendoDataGridStyles;
