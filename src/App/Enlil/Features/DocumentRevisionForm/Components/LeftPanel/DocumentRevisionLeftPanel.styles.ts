import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../../../ui/layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    titleText: {
      "position": "static",
      "top": "0%",
      "bottom": "0%",
      "font-family": "Sora",
      "font-style": "normal",
      "font-weight": "600",
      "font-size": "12px",
      "line-height": "15px",
      "color": Colors.dark_jungle_green,
      "flex": "none",
      "order": 0,
      "flex-grow": 0,
      "margin": "0px 5px",
    },
  })
);
