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
      width: "232px",
      height: "232px",
    },
    tab: {
      minWidth: 66,
      fontSize: "10px",
    },
    allTab: {
      position: "absolute",
      width: "5px",
      height: "5px",
      left: "15px",
      top: "21px",
      background: Colors.font_gray,
      borderRadius: "50%",
    },
    overdueTab: {
      position: "absolute",
      width: "5px !important",
      height: "5px !important",
      left: "3px",
      top: "21px",
      background: Colors.trinary_red,
      borderRadius: "50%",
    },
    dueInSevenTab: {
      position: "absolute",
      width: "5px !important",
      height: "5px !important",
      left: "3px",
      top: "21px",
      background: Colors.latest_yellow_varient,
      borderRadius: "50%",
    },
    tabHeader: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "10px",
      lineHeight: "13px",
    },
  })
);
