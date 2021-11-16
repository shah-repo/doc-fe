import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export const DRAWER_WIDTH = 240;

export default makeStyles((theme: Theme) =>
  createStyles({
    link: {
      "color": Colors.white,
      "backgroundColor": Colors.mirage,
      "&:hover": {
        color: Colors.white,
        backgroundColor: Colors.bright_grey,
      },
      "& svg": {
        stroke: Colors.white,
      },
    },
    childLink: {
      paddingLeft: theme.spacing(6),
    },
    activeLink: {
      "backgroundColor": Colors.bright_grey,
      "color": Colors.white,
      "& .MuiListItemText-primary": {
        fontWeight: "bold",
      },
      "&:hover": {
        backgroundColor: Colors.bright_grey,
        color: Colors.white,
      },
      "& svg": {
        stroke: Colors.white,
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
      "backgroundColor": Colors.white,
      "mask":
        `url(${iconLink}) no-repeat center / contain`,
      "-webkit-mask":
        `url(${iconLink}) no-repeat center / contain`,
    }),
    iconActive: {
      backgroundColor: `${Colors.white} !important`,
    },
  })
);
