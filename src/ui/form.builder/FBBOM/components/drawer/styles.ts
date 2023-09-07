import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Colors } from '../../../../layout/theme-next';

export default makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      display: 'flex',
      flexDirection: 'row',
      borderRadius: 3,
      background: Colors.light_cyan,
      fontWeight: 600,
      fontSize: 10,
      lineHeight: 1.3,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      textTransform: 'uppercase',
    },
    partInfo: {
      marginTop: theme.spacing(1.25),
    },
    docId: {
      height: 24,
      fontFamily: 'Sora',
      fontWeight: 700,
      fontSize: 17,
      color: Colors.textBlack,
    },
    divider: {
      margin: theme.spacing(2, 0),
    },
    headerInfo: {
      height: 24,
      fontFamily: 'Sora',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 16,
      color: Colors.textBlack,
    },
    chipContainer: {
      marginLeft: theme.spacing(2.5),
    },
    iconContainer: {
      display: 'flex',
      height: 24,
      flex: 'none',
      margin: theme.spacing(0, 0.25),
    },
    whiteDot: {
      width: 4,
      height: 4,
      margin: theme.spacing(0, 0.625),
      position: 'relative',
      background: Colors.textBlack,
    },
    iconButton: {
      height: 24,
      width: 24,
      borderRadius: 6,
      marginLeft: theme.spacing(2.5),
    },
    launchIcon: {
      color: Colors.textGray,
      width: 17,
      height: 17,
    },
    closeIcon: {
      height: 24,
      width: 24,
      color: Colors.textGray,
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
      color: Colors.textGray,
      border: `1px solid ${Colors.textGray}`,
    },
    drawer: {
      margin: theme.spacing(1.25),
      height: '100%',
      width: 950,
    },
    drawerDiv: {
      margin: 30,
      width: 950,
    },
  }),
);
