import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const DRAWER_WIDTH = 240;

export default makeStyles((theme: Theme) =>
  createStyles({
    link: {
      "color": theme.palette.secondary.contrastText,
      "backgroundColor": theme.palette.secondary.main,
      "&:hover": {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
      },
      "& svg": {
        stroke: theme.palette.secondary.contrastText,
      },
    },
    childLink: {
      paddingLeft: theme.spacing(6),
    },
    activeLink: {
      "backgroundColor": theme.palette.secondary.contrastText,
      "color": theme.palette.secondary.main,
      "& .MuiListItemText-primary": {
        fontWeight: "bold",
      },
      "&:hover": {
        backgroundColor: theme.palette.secondary.contrastText,
        color: theme.palette.secondary.main,
      },
      "& svg": {
        stroke: theme.palette.secondary.main,
      },
    },
    itemIcon: {
      color: "inherit",
      minWidth: "40px",
    },
    itemText: {
      color: "inherit !important",
      letterSpacing: 0,
      fontFamily: "Open Sans",
    },
    menu: {
      paddingTop: 4,
      paddingBottom: 4,
      marginTop: 5,
      fontSize: "11px",
    },
    icon: ({ iconLink }) => ({
      "width": 20,
      "height": 20,
      "backgroundColor": theme.palette.secondary.contrastText,
      "mask":
        `url(${iconLink}) no-repeat center / contain`,
      "-webkit-mask":
        `url(${iconLink}) no-repeat center / contain`,
    }),
    iconActive: {
      backgroundColor: `${theme.palette.secondary.main} !important`,
    },
  })
);
