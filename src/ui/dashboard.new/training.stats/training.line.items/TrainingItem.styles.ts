import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    typographyDueInfewDays: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "15px",
      color: Colors.latest_yellow_varient,
    },
    typographyOverdue: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "15px",
      color: Colors.latest_red_varient,
    },
    name: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "12px",
      lineHeight: "15px",
      display: "flex",
      alignItems: "center",
      marginLeft: "5px",
      color: Colors.font_black,
    },
    docIdAndTitle: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "22px",
      color: Colors.font_black,
    },
    date: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "15px",
      color: Colors.font_gray,
    },
    avatar: {
      width: "30px",
      height: "30px",
    },
    avatarSection: {
      display: "flex",
    },
  })
);
