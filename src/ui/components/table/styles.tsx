import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';
import { TableStyleProps } from './types';

export const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
  },
  table: {
    innerHeight: '100%',
    fontSize: theme.typography.fontSize,
  },
  header: {
    margin: '0!important',
  },
  rowEven: {
    backgroundColor: '#e8e9ed',
  },
  rowOdd: {
    backgroundColor: 'transparent',
  },
  emptyMsg: {
    padding: theme.spacing(2),
  },
  row: (props: TableStyleProps) => ({
    paddingRight: '0!important',
    cursor: (props.isSelectable) ? 'pointer' : 'default',
    borderBottom: `1px solid ${theme.palette.text.hint}`,
    '&:hover': {
      background: '#F8F9FF',
    },
  }),
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogContent: { padding: theme.spacing(4, 4, 3, 3) },
  dialogAction: { padding: theme.spacing(3, 2), backgroundColor: Colors.white_smoke },
  closeIcon: { padding: 0 },
  formControl: { width: '100%' },
  dateContainer: { height: '110px' },
  clearButton: {
    margin: theme.spacing(0, 2, 0, 0),
    backgroundColor: Colors.white,
    borderRadius: 25,
    textTransform: 'none',
    fontSize: 12,
    fontWeight: 600,
    color: Colors.navy,
    border: 'none',
  },
  printButton: {
    margin: theme.spacing(0, 2, 0, 0),
    backgroundColor: `${Colors.navy} !important`,
    borderRadius: 25,
    textTransform: 'none',
    fontSize: 12,
    fontWeight: 600,
    color: Colors.white,
    border: `1px solid ${Colors.navy}`,
  },
  pHCheckbox: {
    marginTop: theme.spacing(-2.50),
  },
}));

export const qtyLabelStyle = makeStyles({
  qtyLabel: (gridSize: number) => ({
    width: `${gridSize}px`,
  }),
});

export const labelPropsStyle = {
  color: Colors.gray,
  display: 'flex',
  alignItems: 'center',
  marginLeft: '10px',
};
