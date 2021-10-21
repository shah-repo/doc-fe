import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: "inline",
    },
    listItemIcon: {
      paddingLeft: "10px",
    },
    actionIcons: {
      /* Action Icons */
      /* Auto Layout */
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: "0px 10px",
      position: "absolute",
      width: "44px",
      height: "62px",
      right: "0px",
      top: "0px",
      /* Highlight */
      background: Colors.sky_blue,
    },
    typographyDueInfewDays: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "13px",
      lineHeight: "16px",
      color: Colors.latest_yellow_varient,
    },
    typographyOverdue: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "13px",
      lineHeight: "16px",
      color: Colors.latest_red_varient,
    },
    typography: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 400,
    },
    typographyBold: {
      fontSize: "14px",
      fontFamily: "Sora",
      fontWeight: 600,
    },
    typographyStatus: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "14px",
      lineHeight: "15px",
    },
    timestampContainer: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "22px",
      color: Colors.font_gray,
    },
  })
);
