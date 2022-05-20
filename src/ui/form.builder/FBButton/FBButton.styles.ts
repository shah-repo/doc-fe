import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    root: ({ isHover }) => ({
      "margin": "0px",
      "border": `1px dashed ${Colors.navy}`,
      "borderRadius": "100px",
      "background": isHover ? Colors.navy : Colors.white,
      "&:hover": {
        background: Colors.navy,
      },
    }),
    label: ({ isHover }) => ({
      "padding": "2px",
      "fontWeight": 700,
      "fontSize": "12px",
      "lineHeight": "15px",
      "text-transform": "capitalize",
      "white-space": "nowrap",
      "color": isHover ? Colors.white : Colors.navy,
    }),
    fbBtn: {
      "height": "36px",
      "borderRadius": "100px",
      "background": Colors.navy,
      "color": Colors.white,
      "border": `1px solid ${Colors.navy}`,
      "boxShadow": "none",
      "&:hover": {
        background: Colors.navy,
      },
      "&.Mui-disabled": {
        border: "none",
        backgroundColor: Colors.gains_boro,
        color: Colors.spanish_gray,
      },
    },
  })
);
