import { createStyles, Theme } from "@material-ui/core";
import { DRAWER_WIDTH } from "./Navigation.styles";

export default (theme: Theme) =>
  createStyles({
    layout: {
      display: "block",
    },
    content: {
      position: "absolute",
      top: 64,
      bottom: 0,
      left: DRAWER_WIDTH,
      right: 0,
      width: `calc(100% - ${DRAWER_WIDTH})`,
      display: "flex",
      flexDirection: "column",
    },
  });
