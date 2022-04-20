import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    secondaryText: {
      fontFamily: "Sora",
      fontSize: 12,
      color: Colors.font_gray,
      letterSpacing: 0,
    },
    generalInfo: {
      fontFamily: "Sora",
      fontWeight: 600,
      fontSize: 14,
      color: Colors.font_black,
      letterSpacing: 0,
    },
    description: {
      "lineHeight": "21px",
      "fontFamily": "Sora",
      "fontSize": 14,
      "word-break": "break-word",
      "letterSpacing": 0,
    },
  })
);
