import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";
import { HEADER_HEIGHT } from "./Header.styles";
import { DRAWER_WIDTH } from "./Navigation.styles";

export const styles = makeStyles(() =>
  createStyles({
    newContent: {
      "position": "absolute",
      "left": DRAWER_WIDTH,
      "bottom": 0,
      "paddingBottom": 13,
      "right": 0,
      "backgroundColor": Colors.alabaster,
      "scrollbarWidth": "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    content: {
      "position": "fixed",
      "left": DRAWER_WIDTH,
      "top": HEADER_HEIGHT,
      "bottom": 0,
      "right": 0,
      "backgroundColor": Colors.alabaster,
      "scrollbarWidth": "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
  }));
