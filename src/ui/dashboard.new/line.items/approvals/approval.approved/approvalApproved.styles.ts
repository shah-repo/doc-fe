
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: "inline",
    },
    icon: {
      width: "15px",
    },
    listItem: {
      paddingLeft: "1px",
    },
    actionIcon: {
      paddingLeft: "10px",
    },
    viewTooltipText: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "12px",
      lineHeight: "15px",
    },
    nested: {
      // paddingLeft: theme.spacing(4),
      marginLeft: "40px",
      borderLeft: "1px solid #CBD5E0",
      maxWidth: "calc( 100% - 40px)",
      paddingLeft: "25px",
    },
    customTooltipWidth: {
      maxWidth: 500,
    },
    collapsedList: {
      backgroundColor: Colors.sky_blue,
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
      width: "78px",
      height: "62px",
      right: "0px",
      top: "0px",
      /* Highlight */
      background: Colors.sky_blue,
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
  }
  ));
