import { makeStyles } from '@material-ui/core';
import ThemeColors from '../../../../../layout/theme-next/colors';
import Colors from '../../../../../layout/theme/utils/colors';

export const styles = makeStyles((theme) => ({
  chip: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 3,
    border: `1px solid ${Colors.steel_blue}`,
    background: Colors.light_cyan,
    fontWeight: 600,
    fontSize: 10,
    lineHeight: 1.3,
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.lochmara,
    cursor: 'pointer',
  },
  GREEN_STATUS: {
    background: Colors.carla,
    color: Colors.light_forest_green,
    border: `1px solid ${Colors.light_forest_green_border}`,
  },
  PENDING_STATUS: {
    background: Colors.old_lace,
    color: Colors.tawny,
    border: `1px solid ${Colors.ochre}`,
  },
  GRAY_STATUS: {
    background: Colors.lily_white,
    color: Colors.font_gray,
    border: `1px solid ${Colors.font_gray}`,
  },
  dot: {
    height: 10,
    width: 10,
  },
  selectedDot: {
    color: Colors.almost_black,
  },
  deselectedDot: {
    color: Colors.dark_gray2,
  },
  nameCell: (props) => ({
    'vertical-align': 'middle',
    marginLeft: (props.isEditMode || !props?.hasChildren) ? 0 : theme.spacing(1.875),
  }),
  titleInfoCell: (props) => ({
    fontWeight: props?.hasChildren ? 600 : 400,
    fontFamily: 'Sora',
    fontSize: 14,
    lineHeight: '16.64px',
  }),
  Cell: {
    ontWeight: 400,
    fontFamily: 'Sora',
    fontSize: 14,
    lineHeight: '17.64px',
  },
  cellborderBottom: {
    borderBottom: `1px solid ${Colors.alice_blue} !important`,
    borderLeft: '0 !important',
  },
  actionsCell: {
    width: 0,
    overflow: 'visible !important',
    position: 'sticky',
    right: 0,
    padding: '0 !important',
  },
  updatingRow: {
    position: 'relative',
    zIndex: 3,
    outline: `1px solid ${ThemeColors.primaryLight}`,
    outlineOffset: -1,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.75, 0.75),
  },
  actions: {
    gap: theme.spacing(1.25, 1.25),
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1.25),
    backgroundColor: ThemeColors.primaryLight,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    position: 'absolute',
    zIndex: 3,
    right: 0,
    top: '100%',
  },
  deleteIcon: {
    color: ThemeColors.error,
  },
  replaceIcon: {
    color: ThemeColors.error,
  },
  restoreIcon: {
    color: ThemeColors.error,
  },
  tooltipContent: {
    maxWidth: 425,
    maxHeight: 200,
    overflow: 'auto',
    whiteSpace: 'pre-line',
    paddingRight: theme.spacing(0.5),
    marginRight: theme.spacing(-0.5),
  },
  expand: {
    cursor: 'pointer',
  },
  infoIcon: {
    width: '1.5em',
    marginRight: theme.spacing(1.5),
  },
  ownerIcon: {
    width: '1.5em',
    color: ThemeColors.primaryLight,
    marginLeft: theme.spacing(1.5),
  },
}));
