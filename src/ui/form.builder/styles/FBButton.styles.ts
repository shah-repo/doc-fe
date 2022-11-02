import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const FBButtonStyles = makeStyles(() =>
  createStyles({
    button: {
      "backgroundColor": Colors.navy,
      "borderRadius": "100px",
      "fontFamily": "Sora",
      "fontSize": 12,
      "fontWeight": 600,
      "color": Colors.white,
      "border": `1px solid ${Colors.navy}`,
      "&.Mui-disabled": {
        border: "none",
        backgroundColor: Colors.gains_boro,
        color: Colors.spanish_gray,
      },
      "&:hover": {
        backgroundColor: Colors.navy,
      },
      "padding": "12px 25px",
    },
    margin: {
      margin: 0,
    },
    btnMargin: {
      margin: "7px 10px 0 10px",
    },
  }));
