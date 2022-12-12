import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    secondaryText: {
      fontSize: 12,
      color: Colors.font_gray,
      letterSpacing: 0,
    },
    generalInfo: {
      fontWeight: 600,
      fontSize: 14,
      color: Colors.almost_black,
      letterSpacing: 0,
    },
    description: {
      "lineHeight": "21px",
      "fontSize": 14,
      "word-break": "break-all",
      "letterSpacing": 0,
    },
  })
);
