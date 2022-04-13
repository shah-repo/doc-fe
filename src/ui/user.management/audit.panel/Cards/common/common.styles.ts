import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    secondaryText: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "12px",
      color: Colors.font_gray,
      letterSpacing: 0,
    },
    generalInfo: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      color: Colors.font_black,
      lineHeight: "150%",
      flex: "none",
      order: 0,
      flexGrow: 0,
      margin: " 0px 0px",
      letterSpacing: 0,
    },
    description: {
      "fontWeight": 700,
      "lineHeight": "21px",
      "fontFamily": "Sora",
      "fontStyle": "normal",
      "fontSize": 14,
      "word-break": "break-word",
      "letterSpacing": 0,
    },
  })
);
