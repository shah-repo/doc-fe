import { createStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";
import { DRAWER_WIDTH } from "./Navigation.styles";

export default (theme: Theme) =>
  createStyles({
    newContent: {
      "position": "absolute",
      "left": DRAWER_WIDTH + 50,
      "top": 90,
      "bottom": 0,
      "right": 50,
      "borderRadius": 12,
      "backgroundColor": Colors.alabaster,
      "scrollbarWidth": "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    content: {
      "position": "absolute",
      "left": DRAWER_WIDTH,
      "top": 48,
      "bottom": 0,
      "right": 0,
      "overflow": "auto",
      "backgroundColor": Colors.alabaster,
      "scrollbarWidth": "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  });
