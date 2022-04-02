import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    typographyDueInfewDays: {
      fontFamily: "Sora",
      fontWeight: 700,
      fontSize: "12px",
      color: Colors.latest_yellow_varient,
      letterSpacing: 0,
    },
    typographyOverdue: {
      fontFamily: "Sora",
      fontWeight: 700,
      fontSize: "12px",
      color: Colors.latest_red_varient,
      textTransform: "uppercase",
      letterSpacing: 0,
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
      color: Colors.almost_black,
    },
    docIdAndTitle: {
      "fontFamily": "Sora",
      "fontStyle": "normal",
      "fontWeight": 600,
      "fontSize": "14px",
      "lineHeight": "22px",
      "color": Colors.almost_black,
      "& > p": {
        margin: "0px",
      },
    },
    contentSection: {
      marginTop: "2%",
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
      fontSize: "12px",
      fontWeight: 600,
      color: Colors.white,
      fontFamily: "Sora",
      textTransform: "uppercase",
    },
    avatarSection: {
      display: "flex",
    },
    margin5: {
      marginRight: "5px",
    },
  })
);
