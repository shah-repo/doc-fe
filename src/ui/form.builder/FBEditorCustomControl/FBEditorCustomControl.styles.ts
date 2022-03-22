import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
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
    listItemStyle: {
      "height": "48px",
      "width": "269px",
      "background": "white",
      "border": `1px solid ${Colors.lightest_grey1}`,
      "borderRadius": "3px",
      "marginBottom": "10px",
      "& $lastItem": {
        marginBottom: 0,
      },
    },
  })
);
