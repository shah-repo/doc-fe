import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../../../ui/layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    sidebar: (drawerOpen: boolean) => ({
      transition: drawerOpen
        ? "all .2s ease-in"
        : " all .2s ease-out",
      background: Colors.white,
      filter: `drop-shadow(0px 4px 24px rgba(22, 34, 41, 0.06))`,
      borderRadius: "7px",
      marginRight: "13px",
      marginTop: 0,
    }),
    iconBox: {
      minWidth: "48px",
      display: "flex",
      height: "48px",
      alignItems: "center",
      justifyContent: "center",
      borderRight: `1px solid ${Colors.light_gray_border}`,
    },
    iconButtonNew: {
      "width": "36px",
      "height": "30px",
      "padding": "0px",
      "&:hover, &:focus, li.active > a": {
        "background": Colors.light_blue,
        "borderRadius": "5px",
        "& svg": {
          stroke: Colors.medium_blue,
        },
      },
      "& svg": {
        stroke: Colors.hint_gray,
      },
      "&.maximize": {
        transform: `scaleX(-1)`,
      },
    },
    tabTitle: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "18px",
      color: Colors.dark_jungle_green,
    },
  }));


export const tooltipStyles = makeStyles(() => ({
  tooltip: {
    backgroundColor: Colors.almost_black,
    fontSize: "12px",
    fontWeight: 400,
  },
  arrow: {
    color: Colors.almost_black,
  },
}));
