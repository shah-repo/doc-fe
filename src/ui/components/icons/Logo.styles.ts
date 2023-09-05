import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Colors from '../../layout/theme/utils/colors';

const styles = makeStyles((theme: Theme) =>
  createStyles({
    svgRoot: {
      height: 'auto',
      width: '60%',
    },
    letters: {
      color: theme.palette.secondary.contrastText,
    },
    icon: {
      color: theme.palette.secondary.light,
    },
    envCnt: {
      background: '0% 0% no-repeat padding-box',
      backgroundColor: theme.palette.secondary.contrastText,
      width: '100%',
      marginBottom: 10,
      display: 'flex',
      justifyContent: 'center',
      height: 25,
      alignItems: 'center',
    },
    evnTxt: {
      textAlign: 'center',
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: 0,
    },
    devtheme: {
      background: Colors.light_slate_blue,
    },
    demotheme: {
      background: Colors.topaz,
    },
    sandboxtheme: {
      background: Colors.blaze_orange,
    },
    logo: {
      maxWidth: '100%',
      padding: theme.spacing(0, 3),
    },
    smallLogo: {
      width: 50,
      height: 50,
    },
    mt0: {
      marginTop: 0,
    },
    mt20: {
      marginTop: 20,
    },
    avatar: {
      width: 58,
      height: 58,
      borderRadius: '50%',
      border: `1px solid ${Colors.mirage}`,
    },
    smallLogoContainer: {
      display: 'flex',
      margin: theme.spacing(0, 0.875),
    },
  }),
);

export default styles;
