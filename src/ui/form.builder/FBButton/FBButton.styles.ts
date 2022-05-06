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
      "fontFamily": "Sora",
      "fontWeight": 700,
      "fontSize": "12px",
      "lineHeight": "15px",
      "text-transform": "capitalize",
      "white-space": "nowrap",
      "color": isHover ? Colors.white : Colors.navy,
      "&:hover": {
        color: Colors.white,
      },
    }),
  })
);
