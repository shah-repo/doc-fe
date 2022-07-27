import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../../../../ui/layout/theme/utils/colors";

export default makeStyles(() =>
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
      "padding": "0 10px 0 15px",
      "width": "300px",
      "height": "50px",
      "boxShadow": `0 1px 0 ${Colors.lightest_grey1}`,
      "borderTop": `1px solid ${Colors.lightest_grey1}`,
      "&.firstItem": {
        borderTop: 0,
      },
    },
    listItemStyle: {
      "height": "48px",
      "width": "269px",
      "background": Colors.white,
      "border": `1px solid ${Colors.lightest_grey1}`,
      "borderRadius": "3px",
      "marginBottom": "10px",
      "&.lastItem": {
        marginBottom: 0,
      },
    },
    listItemText: {
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: "15px",
      display: "flex",
      textTransform: "uppercase",
      color: Colors.almost_black,
    },
    listSubItem: {
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "18px",
      letterSpacing: 0,
      marginLeft: "3px",
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
      padding: "0px",
    },
    iconBtn: { marginLeft: "3px" },
  })
);
