import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      width: "7px",

      position: "static",

      bottom: "5px",
    },
    listItemIcon: {
      paddingLeft: "5px",
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
    nested: {
      // marginLeft: "40px",
      // borderLeft: "1px solid #CBD5E0",
      // maxWidth: "calc( 100% - 40px)",
      // paddingLeft: "25px",
    },
    listrootpending: {
      // position: "absolute",

      overflow: "auto",
      maxHeight: "calc(100vh - 395px)",
      width: "100%",
      // width: "80%",
      // paddingLeft: "28px",
      paddingLeft: "24px",
      // marginTop: "-10px",
      // left: "calc(50% - 194.98px/2 - 107.51px)",
      top: "calc(50% - 18px/2)",
      // top: "calc(20% - 18px/2)",

      backgroundColor: Colors.white,
    },

    listrootapproved: {
      overflow: "auto",
      // maxHeight: "calc(100vh - 342px)",
      maxHeight: "calc(100vh - 418px)",
      width: "100%",
      paddingLeft: "28px",
      // marginTop: "5%",
      left: "calc(50% - 194.98px/2 - 107.51px)",
      top: "calc(50% - 18px/2)",
      backgroundColor: Colors.white,
    },

    listroot: {
      overflow: "auto",
      maxHeight: "calc(100vh - 342px)",
      width: "100%",
      paddingLeft: "28px",
      marginTop: "-10px",
      left: "calc(50% - 194.98px/2 - 107.51px)",
      top: "calc(50% - 18px/2)",
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "15px 20px",

      position: "relative",
      width: "450px",
      height: "548px",
      top: "12.5%",
      left: "35.5%",

      /* Highlight */

      background: Colors.sky_blue,
      borderRadius: "8px",

      // position: "absolute",
      // width: 460,
      // height: 560,
      // backgroundColor: Colors.background_gray,
      // boxShadow: theme.shadows[5],
      // padding: theme.spacing(2, 4, 3),
      // top: `50%`,
      // left: `50%`,
      // transform: `translate(-50%, -50%)`,
    },
    pendingbg: {
      background: Colors.white,

      display: "flex",
      // flexDirection: "column",
      alignItems: "flex-start",
      padding: "20px",

      position: "static",
      width: "410px",
      height: "415px",
      left: "20px",
      top: "48px",

      /* White */

      border: "1px solid #F5F8FF",
      boxSizing: "border-box",
      borderRadius: "8px",
    },
    approvedbg: {

      background: Colors.white,
      display: "flex",
      // flexDirection: "column",
      alignItems: "flex-start",
      padding: "20px",

      position: "absolute",
      width: "410px",
      // height: "378px",
      left: "20px",
      top: "478px",

      // marginTop: "5%",
      /* White */

      border: "1px solid #F5F8FF",
      boxSizing: "border-box",
      borderRadius: "8px",
    },
    modeltitle: {
      position: "static",
      width: "194.98px",
      height: "18px",
      left: "calc(50% - 194.98px/2 - 107.51px)",
      top: "calc(50% - 18px/2)",

      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "14px",
      lineHeight: "18px",
      /* identical to box height */

      display: "flex",
      alignItems: "center",

      /* Font Black */

      // color: Colors.font_black,
      color: "#080B11",
    },
    closemodel: {
      left: "20.55%",
      right: "0%",
      bottom: "22.15%",
    },
    card: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "20px",

      position: "static",
      width: "410px",
      height: "415px",
      left: "20px",
      top: "48px",

      background: Colors.white,
      border: "1px solid #F5F8FF",
      boxSizing: "border-box",
      borderRadius: "8px",
    },
    panelapprove: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "0px",

      position: "static",
      width: "410px",
      height: "55px",
      left: "20px",
      top: "48px",
      marginTop: "5%",

      background: Colors.white,
      border: "1px solid #F5F8FF",
      boxSizing: "border-box",
      borderRadius: "8px",
    },

    pendingtitle: {
      "position": "static",
      // "width": "77px",
      "height": "15px",
      "left": "calc(50% - 77px/2 - 146.5px)",
      "top": "calc(50% - 15px/2)",
      "marginTop": "7%",
      "fontFamily": "Sora",
      "fontStyle": "normal",
      "fontWeight": "bold",
      "fontSize": "12px",
      "lineHeight": "15px",
      "display": "flex",
      "alignItems": "center",

      /* AR AIR Color */

      "color": Colors.latest_yellow_varient,
      "&:hover": {
        backgroundColor: "transparent",
      },
    },


    approvedtitle: {
      position: "static",
      // width: "77px",
      height: "15px",
      left: "calc(50% - 77px/2 - 146.5px)",
      top: "calc(50% - 15px/2)",
      // marginTop: "5%",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "12px",
      lineHeight: "15px",
      display: "flex",
      alignItems: "center",

      /* AR AIR Color */

      color: "#0DB78D",
    },
    listitemicon: {
      position: "relative",
      left: "-3%",
      right: "77.94%",
      top: "0%",
      bottom: "0%",
      background: "#A2A2A2",
      width: "30px",
      height: "30px",
    },
    listitemtext: {
      position: "static",
      /* width: 99px */
      height: "18px",
      left: "calc(50% - 99px/2 + 20.5px)",
      top: "calc(50% - 18px/2)",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "18px",
      display: "flex",
      alignItems: "center",
      // color: Colors.font_black,
    },
    emailbutton: {
      "position": "static",
      "left": "0%",
      "right": "0%",
      "top": "0%",
      "bottom": "0%",
      "margin": 0,
      "fontFamily": "Sora",
      "fontStyle": "normal",
      "fontWeight": "bold",
      "fontSize": "11px",
      "lineHeight": "14px",
      /* identical to box height */

      "letterSpacing": "0.5px",
      "textTransform": "uppercase",

      /* Enlil Navy */

      "color": Colors.navy,
      "&:hover": {
        backgroundColor: Colors.white,
      },
    },
    emailPaper: {
      // position: "absolute",
      // width: 450,
      // height: 180,
      // backgroundColor: theme.palette.background.paper,
      // boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      top: "50%",
      // left: `50%`,
      transform: "translate(-50%, -50%)",
      position: "relative",
      width: "450px",
      height: "133px",
      background: "#F5F8FF",
      borderRadius: "8px",
      left: "51%",

    },
    confroot: {

      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "20px",

      position: "absolute",
      width: "397px",
      height: "70px",
      left: "33px",
      top: "48px",

      /* White */

      background: "#FFFFFF",
      border: "1px solid #F5F8FF",
      boxSizing: "border-box",
      borderRadius: "8px",
    },
    confmesg: {
      // position: "absolute",
      // left: "8.89%",
      // right: "64.89%",
      // top: "57.14%",
      // bottom: "32.33%",

      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "11px",
      lineHeight: "14px",
      /* identical to box height */

      letterSpacing: "0.5px",
      textTransform: "uppercase",

      /* Enlil Navy */

      color: "#011FBB",

    },
    confmesgdate: {
      // position: "absolute",
      // left: "70.67%",
      // right: "12.22%",
      // top: "57.14%",
      // bottom: "32.33%",
      position: "absolute",
      left: "70.67%",
      top: "26%",
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "11px",
      lineHeight: "14px",
      /* identical to box height */

      textAlign: "right",
      letterSpacing: "0.5px",

      /* Font Gray */

      color: "#767B87",
    },
    title: {
      fontSize: "14px",
    },

    /* For Pending Box Style*/
    pendingBox: {
      flexDirection: "column",
      height: "auto",
      overflowY: "auto",
      top: "48px",
      left: "20px",
      width: "410px",
      border: "1px solid #F5F8FF",
      display: "flex",
      padding: "20px",
      backgroundColor: "#FFF",
      boxSizing: "border-box",
      alignItems: "flex-start",
      borderRadius: "8px",
    },
    /* For Pending Box Style*/
    approvedBox: {
      marginTop: "5%",
      flexDirection: "column",
      height: "auto",
      overflowY: "auto",
      top: "436px",
      left: "20px",
      width: "410px",
      border: "1px solid #F5F8FF",
      display: "flex",
      padding: "20px",
      backgroundColor: "#FFF",
      boxSizing: "border-box",
      alignItems: "flex-start",
      borderRadius: "8px",
    },
    yellowDot: {
      width: "4px",
      height: "4px",
      right: "4px",
      // top: "10px",
      position: "relative",
      background: Colors.latest_yellow_varient,
    },
    iconupdown: {
      width: "20px",
      position: "static",
      bottom: "5px",
    },
  })
);
