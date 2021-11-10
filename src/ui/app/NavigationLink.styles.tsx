import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export const DRAWER_WIDTH = 240;

export default makeStyles((theme: Theme) =>
  createStyles({
    link: {
      "color": Colors.drawer_link_color,
      "backgroundColor": Colors.drawer_link_background,
      "&:hover": {
        color: Colors.drawer_link_hover_color,
        backgroundColor: Colors.drawer_link_hover_background,
      },
      "& svg": {
        stroke: Colors.drawer_active_link_icon_color,
      },
    },
    childLink: {
      paddingLeft: theme.spacing(6),
    },
    activeLink: {
      "backgroundColor": Colors.drawer_link_active_background,
      "color": Colors.drawer_link_active_color,
      "& .MuiListItemText-primary": {
        fontWeight: "bold",
      },
      "&:hover": {
        backgroundColor: Colors.drawer_link_active_hover_background,
        color: Colors.drawer_link_active_hover_color,
      },
      "& svg": {
        stroke: Colors.drawer_active_link_icon_color,
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
      "backgroundColor": Colors.drawer_active_link_icon_color,
      "mask":
        `url(${iconLink}) no-repeat center / contain`,
      "-webkit-mask":
        `url(${iconLink}) no-repeat center / contain`,
    }),
    iconActive: {
      backgroundColor: `${Colors.drawer_link_icon_color} !important`,
    },
  })
);
