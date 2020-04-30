import { createStyles, Theme } from "@material-ui/core";

export const DRAWER_WIDTH = 240;

export default (theme: Theme) =>
  createStyles({
    link: {
      display: "flex",
      textDecoration: "none",
      flex: 1,
    },
    childLink: {
      paddingLeft: theme.spacing(3),
    },
    activeLink: {
      "backgroundColor": theme.palette.secondary.contrastText,
      "& .MuiListItemText-primary": {
        fontWeight: "bold",
      },
    },
    linkButton: {
      padding: 0,
    },
    itemIcon: {
      "color": theme.palette.secondary.contrastText,
      "minWidth": "40px",
      "& svg": {
        stroke: theme.palette.secondary.contrastText,
      },
    },
    itemText: {
      color: theme.palette.secondary.contrastText,
      letterSpacing: 0,
      fontFamily: "Open Sans",
    },
    itemButton: {
      "marginLeft": 5,
      "backgroundColor": theme.palette.secondary.main,
      "&:hover": {
        backgroundColor: theme.palette.secondary.main,
      },
    },
  });
