import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";
import { DRAWER_WIDTH } from "./Navigation.styles";

export const styles = makeStyles(() =>
  createStyles({
    newContent: {
      "position": "absolute",
      "left": DRAWER_WIDTH,
      "bottom": 13,
      "right": 0,
      "backgroundColor": Colors.alabaster,
      "scrollbarWidth": "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    content: (formDocument: boolean) => ({
      "position": "fixed",
      "left": DRAWER_WIDTH,
      "top": formDocument ? 46 : 40,
      "bottom": 0,
      "right": 0,
      "backgroundColor": Colors.alabaster,
      "scrollbarWidth": "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    }),
  }));
