import { makeStyles } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

export default makeStyles((theme) => ({
  list: {
    background: Colors.white,
    border: `1px solid ${Colors.mild_wind_blue}`,
    boxSizing: 'border-box',
    borderRadius: 4,
    marginTop: theme.spacing(1.25),
  },
  approvalsList: {
    margin: theme.spacing(0, 2, 0, 6.25),
  },
  itemCount: {
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 1.25,
    color: Colors.font_gray,
  },
  itemHeader: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 1.25,
    marginLeft: theme.spacing(1.25),
    color: Colors.almost_black,
  },
  expandedItemHeader: {
    color: Colors.navy,
  },
  listItem: {
    background: Colors.white,
    padding: theme.spacing(1.25, 1.25, 1.25, 1),
  },
  stateListItem: {
    cursor: 'pointer',
  },
  avatar: {
    width: 45,
    height: 45,
    margin: theme.spacing(0),
    fontSize: 18,
    color: Colors.white,
    background: Colors.aqua_blue,
    fontWeight: 600,
  },
  stateInfo: {
    fontSize: 12,
    lineHeight: 1.7,
    textAlign: 'right',
    color: Colors.font_gray,
  },
  dateText: {
    color: Colors.font_gray,
  },
  stateText: {
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: Colors.almost_black,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 1.5,
    color: Colors.almost_black,
  },
  emailText: {
    fontSize: 14,
    lineHeight: 1.5,
    color: Colors.font_gray,
    overflowWrap: 'anywhere',
  },
  successIcon: {
    width: 14,
    height: 14,
    marginRight: theme.spacing(.5),
  },
  poButton: {
    fontSize: 12,
    margin: theme.spacing(0, 0, 0, 1),
  },
  poRejectButton: {
    'color': Colors.navy,
    'backgroundColor': 'transparent',
    '&:hover': {
      backgroundColor: Colors.sky_blue,
    },
  },
}));
