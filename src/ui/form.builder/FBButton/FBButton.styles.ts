import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    root: ({ isHover }) => ({
      "margin": "0px",
      "border": `1px dashed ${Colors.navy}`,
      "borderRadius": "100px",
      "background": isHover ? Colors.navy : Colors.white,
      "color": isHover ? Colors.white : Colors.navy,
      "&:hover": {
        background: Colors.navy,
        color: Colors.white,
      },
    }),
    label: {
      "padding": "2px",
      "fontWeight": 700,
      "fontSize": "12px",
      "lineHeight": "15px",
      "text-transform": "capitalize",
      "white-space": "nowrap",
    },
    fbBtn: {
      "height": "36px",
      "borderRadius": "100px",
      "background": Colors.navy,
      "color": Colors.white,
      "border": `1px solid ${Colors.navy}`,
      "boxShadow": "none",
      "&:hover": {
        background: Colors.navy_active,
        borderColor: Colors.navy_active,
        boxShadow: "none",
      },
      "&.Mui-disabled": {
        border: "none",
        backgroundColor: Colors.gains_boro,
        color: Colors.spanish_gray,
      },
      "&.MuiButton-outlinedPrimary": {
        "backgroundColor": Colors.white,
        "borderColor": Colors.navy,
        "color": Colors.navy,
        "&:hover": {
          background: Colors.background_white,
        },
      },
    },
  })
);
