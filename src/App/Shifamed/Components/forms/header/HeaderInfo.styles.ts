import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../../ui/layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    chip: {
      display: "flex",
      flexDirection: "row",
      padding: "0px !important",
      borderRadius: 3,
      marginLeft: "12px",
      background: Colors.white,
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: "10px",
      lineHeight: "13px",
      textTransform: "uppercase",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    title: {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "24px",
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
    groupSection: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "24px",
      color: Colors.white,
    },
    icon: {
      margin: theme.spacing(1),
    },
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
    statusIconReleased: {
      background: Colors.green_blue,
    },
    statusIconCanceled: {
      background: Colors.medium_red,
    },
    id: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "18px",
      color: Colors.white,
    },
    whiteDot: {
      width: "4px",
      height: "4px",
      marginLeft: "5px",
      marginRight: "5px",
      position: "relative",
      background: Colors.white,
    },
    itemWrap: {
      alignSelf: "center",
    },
    statusWrap: {
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
    },
  },
  ));
