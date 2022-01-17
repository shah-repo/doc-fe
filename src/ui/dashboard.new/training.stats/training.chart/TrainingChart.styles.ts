import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    chartContainer: {
      overflow: "auto",
      maxHeight: "calc(100vh - 300px)",
    },
    title: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "20px",
    },
    chartScroll: {
      position: "relative",
      width: "350px",
      height: "130px",
    },
    tab: {
      minWidth: 26,
      fontSize: "10px",
      minHeight: 30,
      marginLeft: 6,
      marginRight: 6,
      paddingLeft: 0,
      paddingRight: 0,
    },
    overdueTab: {
      position: "absolute",
      width: "10px !important",
      height: "10px !important",
      left: 0,
      top: "8px",
      background: Colors.trinary_red,
      borderRadius: "50%",
    },
    dueInSevenTab: {
      position: "absolute",
      width: "10px !important",
      height: "10px !important",
      left: 0,
      top: "8px",
      background: Colors.latest_yellow_varient,
      borderRadius: "50%",
    },
    tabHeader: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "10px",
    },
    legend: {
      marginLeft: "13px",
    },
  })
);
