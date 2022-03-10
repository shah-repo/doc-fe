import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    outerBox: {
      background: "#EBEDF2",
      // width: "270px",
      boxShadow: "0px 1px 0px #C8CACF",
      // height: "483px",
      padding: "15px",
    },
    listStyle: {
      padding: 0,
      background: "#E5E5E5",
    },
    listItemBtn: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0px 10px 0px 15px",
      width: "300px",
      height: "50px",
      background: "white",
      boxShadow: "0px 1px 0px #CCD4D9",
      borderTop: "1px solid #CCD4D9", // need to check if required and put conditional
    },
    listItemStyle: {
      padding: "3px",
      height: "48px",
      width: "269px",
      background: "white",
      border: "1px solid #CCD4D9",
      borderRadius: "3px",
      marginBottom: "8px",
    },
    listItemText: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "15px",
      display: "flex",
      alignItems: "center",
      textAlign: "center",
      textTransform: "uppercase",
      color: "#080B11",
      flex: "none",
      order: 0,
      flexGrow: 0,
    },
    listSubItem: {
      fontFamily: "Sora",
      fontSize: "14px",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "18px",
      letterSpacing: "0px",
      textAlign: "left",
      marginLeft: "6px",
      textTransform: "capitalize",
      color: "#080B11",
    },
  })
);
