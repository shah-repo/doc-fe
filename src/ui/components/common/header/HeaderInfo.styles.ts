import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    statusDefault: {
      color: Colors.white,
      background: Colors.dark_gray,
      padding: "15px 5px",
      borderRadius: "3px",
      fontWeight: "bold",
      marginRight: theme.spacing(2),
    },
    statusIconDefault: {
      background: Colors.gray,
      borderRadius: "50%",
      width: "8px",
      height: "8px",
    },
    arrowPadding: {
      padding: "0px 8px",
    },
    spaceLinePadding: {
      padding: "0px 5px",
    },
    statusIconReleased: {
      background: Colors.light_green,
    },
    statusIconCanceled: {
      background: Colors.medium_red,
    },
    id: {
      fontWeight: "bold",
      marginRight: theme.spacing(2),
    },
    breadcrumbId: {
      fontWeight: 700,
      fontSize: "14px",
      lineHeight: "18px",
      color: Colors.white,
    },
    itemWrap: {
      alignSelf: "center",
    },
    statusWrap: {
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
    },
    groupSection: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "24px",
      color: Colors.white,
      marginLeft: "5px",
    },
    itemIcon: {
      color: "inherit",
      marginLeft: "17px",
      marginRight: "11px",
    },
    icon: ({ iconLink }) => ({
      "width": 18,
      "height": 18,
      "backgroundColor": Colors.white,
      "mask":
        `url(${iconLink}) no-repeat center / contain`,
      "-webkit-mask":
        `url(${iconLink}) no-repeat center / contain`,
    }),
    link: {
      color: Colors.white,
      cursor: "Pointer",
      textDecoration: "none",
    },
    title: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "24px",
      cursor: "pointer",
    },
    mpiTitle: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "24px",
    },
    minWidthSpace: {
      minWidth: "50px",
    },
    subTitleLink: {
      "fontWeight": 600,
      "fontSize": "14px",
      "color": Colors.white,
      "textDecoration": "none",
      "& a": {
        color: Colors.white,
      },
    },
    whiteDot: {
      width: "4px",
      height: "4px",
      marginLeft: "5px",
      marginRight: "5px",
      position: "relative",
      background: Colors.white,
    },
    chip: {
      display: "flex",
      flexDirection: "row",
      padding: "0px !important",
      borderRadius: 3,
      marginLeft: "12px",
      background: Colors.white,
      fontWeight: 700,
      fontSize: "10px",
      lineHeight: "13px",
      textTransform: "uppercase",
      alignItems: "center",
      justifyContent: "center",
    },
    GREEN_STATUS: {
      color: Colors.green_blue,
    },
    RED_STATUS: {
      color: Colors.latest_red_varient,
    },
    CLOSED_STATUS: {
      color: Colors.dawn,
    },
    PENDING_STATUS: {
      color: Colors.school_bus_yellow,
    },
    GRAY_STATUS: {
      color: Colors.mandy,
    },
    WIP_STATUS: {
      color: Colors.raven,
    },
    undefined: {
      color: Colors.dodger_blue,
    },
  },
  ));
