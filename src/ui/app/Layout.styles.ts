import { createStyles, Theme } from "@material-ui/core";
import { DRAWER_WIDTH } from "./Navigation.styles";

export default (theme: Theme) =>
  createStyles({
    content: {
      position: "absolute",
      left: DRAWER_WIDTH,
      top: 64,
      bottom: 0,
      right: 0,
      overflow: "auto",
      backgroundColor: "white",
    },
  });
