import { createStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";
import { DRAWER_WIDTH } from "./Navigation.styles";

export default (theme: Theme) =>
  createStyles({
    newContent: {
      "position": "absolute",
      "left": DRAWER_WIDTH + 60,
      "top": 90,
      "bottom": 0,
      "right": 60,
      "borderRadius": "12px 12px 0 0",
      "overflow": "auto",
      "backgroundColor": Colors.white,
      "scrollbarWidth": "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    content: {
      "position": "absolute",
      "left": DRAWER_WIDTH,
      "top": 64,
      "bottom": 0,
      "right": 0,
      "overflow": "auto",
      "backgroundColor": "white",
      "scrollbarWidth": "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  });
