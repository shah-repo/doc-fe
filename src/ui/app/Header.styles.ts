import { createStyles, Theme } from '@material-ui/core';
import EnlilLogo from '../../assets/images/enlil_logo.svg';
import Colors from '../layout/theme/utils/colors';
import { HeaderPresenterProps } from './Header.presenter';
import { DRAWER_WIDTH } from './Navigation.styles';

export const HEADER_HEIGHT = 48;
const HEADER_HEIGHT_FULL = 160;
export const HEADER_GAP = 96;

export default (theme: Theme) =>
  createStyles({
    appBar: {
      position: 'absolute',
      background: `linear-gradient(260deg, ${Colors.cerulean}, ${Colors.ultramarine_blue} 17%, ${Colors.navy} 85%)`,
      marginLeft: DRAWER_WIDTH,
      color: Colors.white,
      zIndex: 1,
    },
    toolbar: (props: HeaderPresenterProps) => ({
      'marginLeft': DRAWER_WIDTH,
      'minHeight': props.fullHeight ? HEADER_HEIGHT_FULL : HEADER_HEIGHT,
      'paddingBottom': props.fullHeight ? HEADER_HEIGHT_FULL - HEADER_GAP : 0,
      'paddingLeft': theme.spacing(props.fullHeight ? 8 : 3),
      'paddingRight': theme.spacing(props.fullHeight ? 6 : 3),
      '&::before': {
        content: "''",
        position: 'absolute',
        left: '70%',
        right: 0,
        top: 0,
        bottom: 0,
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${EnlilLogo})`,
      },
      '& .MuiFormControlLabel-label': {
        whiteSpace: 'nowrap',
      },
    }),
    welcomeText: {
      fontSize: '1.75rem',
      lineHeight: 1.2,
      fontWeight: 300,
      flexGrow: 1,
      marginRight: theme.spacing(4),
    },
    welcomeTextName: {
      fontWeight: 700,
    },
  });
