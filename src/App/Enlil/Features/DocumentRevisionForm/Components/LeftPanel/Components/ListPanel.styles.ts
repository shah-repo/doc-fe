import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../../../../ui/layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    outerBox: {
      background: Colors.whitest_grey,
      boxShadow: `0px 1px 0px ${Colors.chinese_silver}`,
      padding: "15px",
    },
    listStyle: {
      padding: 0,
      background: Colors.platinum,
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
      boxShadow: `0px 1px 0px ${Colors.lightest_grey1}`,
      borderTop: `1px solid ${Colors.lightest_grey1}`, // need to check if required and put conditional
    },
    listItemStyle: {
      padding: "3px",
      height: "48px",
      width: "269px",
      background: "white",
      border: `1px solid ${Colors.lightest_grey1}`,
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
      color: Colors.almost_black,
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
      color: Colors.almost_black,
      cursor: "pointer",
    },
    searchBox: {
      padding: "10px 0px 20px 0px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    list: {
      height: "calc(100vh - 165px)",
      overflowY: "auto",
      width: "99.8%",
    },
  })
);
