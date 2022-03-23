import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../../../../ui/layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    collapseRoot: {
      padding: "15px",
      background: Colors.whitest_grey,
    },
    outerBox: {
      background: Colors.whitest_grey,
    },
    listStyle: {
      padding: 0,
      background: Colors.whitest_grey,
    },
    listItemBtn: {
      "display": "flex",
      "flexDirection": "row",
      "justifyContent": "space-between",
      "alignItems": "center",
      "padding": "0 10px 0 15px",
      "width": "300px",
      "height": "50px",
      "background": "white",
      "boxShadow": `0 1px 0 ${Colors.lightest_grey1}`,
      "borderTop": `1px solid ${Colors.lightest_grey1}`,
      "&.firstItem": {
        borderTop: 0,
      },
    },
    listItemStyle: {
      "height": "48px",
      "width": "269px",
      "background": "white",
      "border": `1px solid ${Colors.lightest_grey1}`,
      "borderRadius": "3px",
      "marginBottom": "10px",
      "&.lastItem": {
        marginBottom: 0,
      },
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
      letterSpacing: 0,
      textAlign: "left",
      marginLeft: "6px",
      textTransform: "capitalize",
      color: Colors.almost_black,
      cursor: "pointer",
    },
    searchBox: {
      padding: "20px 0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    list: {
      height: "calc(100vh - 165px)",
      overflowY: "auto",
      width: "99.8%",
      padding: "0px",
    },
    iconBtn: { marginLeft: "3px" },
  })
);
