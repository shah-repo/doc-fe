import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';
import { FBMEQItemStatus } from './FBMaterailEqInfo.types';

const FBMEQItemStatusBorder: Record<FBMEQItemStatus, Colors> = {
  [FBMEQItemStatus.Removed]: Colors.opal_red,
  [FBMEQItemStatus.Added]: Colors.light_green,
  [FBMEQItemStatus.Updated]: Colors.gray,
  [FBMEQItemStatus.None]: Colors.medium_blue,
};

const FBMEQItemStatusBg: Record<FBMEQItemStatus, Colors> = {
  [FBMEQItemStatus.Removed]: Colors.medium_red,
  [FBMEQItemStatus.Added]: Colors.pale_green,
  [FBMEQItemStatus.Updated]: Colors.platinum_gray,
  [FBMEQItemStatus.None]: Colors.light_blue,
};

export const useItemStatusStyles = makeStyles((theme) =>
  Object.keys(FBMEQItemStatus).reduce((styles, key) => ({
    ...styles,
    [FBMEQItemStatus[key]]: {
      backgroundColor: FBMEQItemStatusBg[FBMEQItemStatus[key]],
      borderColor: FBMEQItemStatusBorder[FBMEQItemStatus[key]],
    },
  }), {})
);

export default makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(3),
  },
  panel: {
    marginBottom: theme.spacing(1),
    border: `1px solid ${Colors.gray_goose}`,
    borderRadius: theme.spacing(.5),
  },
  panelSummary: {
    'flexDirection': 'row-reverse',
    'alignItems': 'center',
    'padding': 0,
    '&.Mui-expanded': {
      minHeight: 0,
      color: Colors.navy,
    },
  },
  panelSummaryIcon: {
    'color': Colors.almost_black,
    '&.Mui-expanded': {
      color: Colors.navy,
      transform: 'rotate(90deg)',
    },
  },
  panelSummaryContent: {
    'justifyContent': 'space-between',
    'alignItems': 'center',
    'padding': theme.spacing(0, 2, 0, 1.25),
    '&.Mui-expanded': {
      margin: 0,
    },
  },
  panelSummaryTitle: {
    fontWeight: 600,
    fontSize: 16,
  },
  panelSummaryCount: {
    color: Colors.font_gray,
    fontSize: 13,
  },
  panelDetails: {
    padding: theme.spacing(0, 2, .5, 5),
    margin: theme.spacing(-2, 0, 0),
  },
  panelDetailsList: {
    width: '100%',
  },
  chip: {
    borderRadius: theme.spacing(.5),
    backgroundColor: Colors.whitest_grey,
    marginRight: 5,
    fontSize: 12,
    lineHeight: 1.25,
  },
  panelDetailsListItem: {
    padding: theme.spacing(.75, 1),
    display: 'block',
  },
  diffSwitch: {
    marginBottom: theme.spacing(2),
  },
  switchLabel: {
    fontSize: 14,
    color: Colors.almost_black,
    margin: 0,
  },
  switchRoot: {
    width: theme.spacing(3),
    height: theme.spacing(2),
    padding: 0,
    marginRight: theme.spacing(1),
  },
  switchBase: {
    'padding': 1,
    '&.Mui-checked': {
      'transform': `translateX(${theme.spacing(1)}px)`,
      'color': Colors.white,
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: Colors.navy,
        border: 'none',
      },
    },
  },
  switchThumb: {
    width: theme.spacing(2) - 2,
    height: theme.spacing(2) - 2,
    boxShadow: 'none',
  },
  switchTrack: {
    borderRadius: theme.spacing(1),
    opacity: 1,
    backgroundColor: Colors.dawn,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  switchChecked: {},
  expandButton: {
    'color': Colors.navy,
    'fontWeight': 400,
    'padding': 0,
    'margin': 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  navTitle: {
    fontSize: 12,
    fontWeight: 600,
    margin: theme.spacing(.25, 0),
  },
  navItem: {
    'borderRadius': theme.spacing(.5),
    'padding': theme.spacing(1, 1.25),
    'marginBottom': theme.spacing(.5),
    'color': Colors.navy,
    'fontSize': 12,
    '&.Mui-selected': {
      'backgroundColor': Colors.light_cream_blue,
      '&:hover': {
        backgroundColor: Colors.light_cream_blue,
      },
    },
    '&:hover': {
      backgroundColor: Colors.light_cream_blue,
    },
  },
}));
