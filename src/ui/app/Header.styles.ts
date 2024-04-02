import { createStyles } from '@material-ui/core';
import EnlilLogo from '../../assets/images/enlil_logo.svg';
import { NextTheme } from '../layout/theme-next/provider';
import Colors from '../layout/theme/utils/colors';
import { HeaderPresenterProps } from './Header.presenter';
import { DRAWER_WIDTH } from './Navigation.styles';

export const HEADER_HEIGHT = 48;
const HEADER_HEIGHT_FULL = 160;
export const HEADER_GAP = 96;
export const COLLAPSE_BAR_SPACE = 72;
export const MOBILECOLLAPSE_BAR_SPACE = -5;

export default (theme: NextTheme) =>
  createStyles({
    appBar: {
      position: 'absolute',
      background: `linear-gradient(260deg, ${Colors.cerulean}, ${Colors.ultramarine_blue} 17%, ${Colors.navy} 85%)`,
      marginLeft: DRAWER_WIDTH,
      color: Colors.white,
      zIndex: 1,
      '&::before': {
        content: "''",
        position: 'absolute',
        left: '75%',
        right: 0,
        top: 0,
        bottom: 0,
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${EnlilLogo})`,
      },
    },
    lightBg: {
      background: `linear-gradient(225deg,${Colors.navy} 0%,${Colors.ultramarine_blue} 29.56%,${Colors.navy} 100%)`,
    },
    toolbar: (props: HeaderPresenterProps) => ({
      marginLeft: props.isOpened ? DRAWER_WIDTH : COLLAPSE_BAR_SPACE,
      minHeight: props.fullHeight ? HEADER_HEIGHT_FULL : HEADER_HEIGHT,
      paddingBottom: props.fullHeight ? HEADER_HEIGHT_FULL - HEADER_GAP : 0,
      paddingLeft: theme.spacing(props.fullHeight ? 8 : 3),
      paddingRight: theme.spacing(props.fullHeight ? 6 : 3),
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
    welcomeHide: {
      display: 'unset',
    },
    mobileMake: {
      display: 'none',
    },
    mobileLogoText: {
      marginLeft: theme.spacing(2),
      fontSize: 15,
      fontWeight: 600,
    },
    mobileAvatar: {
      width: 35,
      height: 35,
      borderRadius: '50%',
    },
    [theme.media.mobile]: {
      welcomeText: {
        fontSize: '1.25rem',
        marginRight: 0,
        whiteSpace: 'nowrap',
        marginBottom: `${theme.spacing(0)}!important`,
      },
      mobileStyle: {
        display: 'none',
      },
      mobileMake: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 52,
        padding: `${theme.spacing(1.5)}px`,
        background: 'linear-gradient(166deg, #2f01bb, #2ea2dc 100%, #783bff 100%)',
        '& > div': {
          display: 'flex',
          alignItems: 'center',
        },
      },
      mobileGrwFlex: {
        display: 'none',
      },
      toolbar: {
        minHeight: '105px !important',
        marginLeft: '0px !important',
        paddingBottom: '77px !important',
        paddingLeft: '12px !important',
        paddingTop: '22px !important',
      },
      appBar: {
        '&::before': {
          display: 'none',
        },
      },
      mobileSide: {
        width: 15,
        height: 15,
        borderRadius: 4,
        padding: theme.spacing(1),
        background: Colors.gradient_color,
      },
      logoMobile: {
        marginLeft: theme.spacing(1),
      },
      welcomeHide: {
        display: 'none',
      },
      toggleCustomLabels: {
        [theme.breakpoints.down('md')]: {
          display: 'none',
        },
      },
      toggleCustomLabelsSm: {
        [theme.breakpoints.down('sm')]: {
          display: 'none',
        },
      },
      autosaveToggle: {
        [theme.breakpoints.down('md')]: {
          display: 'none',
        },
      },
    },
    mobileGrwFlex: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    welcomeTextResponsive: {
      [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(-4),
      },
    },
  });
