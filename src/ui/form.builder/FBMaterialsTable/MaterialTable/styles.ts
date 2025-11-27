import { makeStyles } from '@material-ui/core';
import { globalTreeListStyles } from '../../../components/common/kendo/GlobalTreelistStyles';
import { Colors } from '../../../layout/theme-next';

export default makeStyles((theme) => ({
  '@global': globalTreeListStyles(theme),
  root: {
    margin: theme.spacing(1, 0),
  },
  borderBottom: {
    borderBottom: `1px solid ${Colors.textGray} !important`,
    borderLeft: '0 !important',
  },
  toggleExpandCollapse: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 400,
    cursor: 'pointer',
    height: 24,
  },
  bottomAddButtom: {
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  updatingRow: {
    backgroundColor: Colors.gray,
    position: 'relative',
    zIndex: 2,
    outline: `1px solid ${Colors.primaryLight}`,
    outlineOffset: -1,
    '& td': {
      whiteSpace: 'normal !important' as 'normal',
    },
    '& td:not(:last-child)': {
      verticalAlign: 'top !important',
    },
  },
  actionsCell: {
    overflow: 'visible !important',
    position: 'sticky',
    right: 0,
    width: '0 !important',
    padding: '0 !important',
    verticalAlign: 'bottom !important',
    borderLeft: `1px solid ${Colors.primaryLight} !important`,
  },
  popperHolder: {
    height: '100%',
  },
  whiteBg: {
    backgroundColor: Colors.white,
  },
  grayBg: {
    backgroundColor: Colors.gray,
  },
  errorBg: {
    backgroundColor: `${Colors.errorLightShadow} !important`,
  },
  viewIcon: {
    fill: Colors.textBlack,
    paddingRight: theme.spacing(1.25),
    width: 14,
    height: 14,
    cursor: 'pointer',
  },
  maximizeIconContainer: {
    marginLeft: theme.spacing(1.25),
    cursor: 'pointer',
  },
  exportExcelIcon: {
    color: Colors.textBlack,
    paddingRight: theme.spacing(1.25),
    width: 14,
    height: 14,
    cursor: 'pointer',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.white,
    opacity: 0.7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    zIndex: 1,
  },
  treeList: {
    width: '100%',
    maxHeight: 'auto',
    overflow: 'auto',
  },
}));
