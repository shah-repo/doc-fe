import { makeStyles, createStyles } from '@material-ui/core';

export const useStyles = makeStyles(() =>
  createStyles({
    supplierGrid: {
    '& .k-grid-header': {
      position: 'sticky',
      top: 0,
      zIndex: 3,
    },
    '& .k-grid-header-locked': {
      position: 'sticky',
      top: 0,
      zIndex: 4,
    },
    '& .k-grid-header-wrap': {
      overflow: 'hidden',
    },
    '& .k-header': {
      whiteSpace: 'normal',
      lineHeight: 1.2,
    },
  },
  header: {
    whiteSpace: 'normal',
    overflow: 'visible',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '1.2',
    '& .k-link': {
      overflow: 'visible',
      whiteSpace: 'normal',
    },
    '& .k-column-title': {
      overflow: 'visible',
      textOverflow: 'unset',
      whiteSpace: 'normal',
    },
  },
  }),
);
