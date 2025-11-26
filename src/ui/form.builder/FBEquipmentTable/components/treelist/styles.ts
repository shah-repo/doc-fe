import { makeStyles } from '@material-ui/core';
import { Size } from 'react-virtualized';
import { globalTreeListStyles } from '../../../../components/common/kendo/GlobalTreelistStyles';
import { Colors } from '../../../../layout/theme-next';
import OldColors from '../../../../layout/theme/utils/colors';

export default makeStyles((theme) => ({
  '@global': globalTreeListStyles(theme),
  root: {
    margin: theme.spacing(1, 0),
  },
  borderBottom: {
    borderBottom: `1px solid ${OldColors.alice_blue} !important`,
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
  treeList: ({ size }: { size?: Size }) => ({
    width: '100%',
    maxHeight: size ? (size.height - 160) : 'auto',
    overflow: 'auto',
  }),
}));
