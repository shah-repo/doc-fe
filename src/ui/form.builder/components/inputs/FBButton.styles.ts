import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    root: {
      "margin": "0px",
      "padding": "10px 20px",
      "borderRadius": "100px",
      "fontFamily": "Sora",
      "fontStyle": "normal",
      "lineHeight": "15px",
      "background": Colors.light_blue2,
      "color": Colors.navy,
      "&:hover": {
        background: Colors.bright_gray2,
        color: Colors.navy,
      },
      "&.Mui-disabled": {
        backgroundColor: Colors.dark_gray2,
        color: Colors.white,
      },
    },
  })
);
