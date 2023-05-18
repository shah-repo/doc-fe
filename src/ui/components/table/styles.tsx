import { makeStyles } from '@material-ui/core';
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
    'paddingRight': '0!important',
    'cursor': (props.isSelectable) ? 'pointer' : 'default',
    'borderBottom': `1px solid ${theme.palette.text.hint}`,
    '&:hover': {
      background: '#F8F9FF',
    },
  }),
}));
