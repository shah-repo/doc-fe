import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    listRoot: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      padding: "0px 5px",
      overflow: "auto",
      minHeight: "125px",
      maxHeight: "calc(100vh - 419px)",
    },
    lineItemContent: {
      height: "100px",
    },
    loadMoreButton: {
      "position": "static",
      "left": "0%",
      "right": "18.54%",
      "top": "0%",
      "bottom": "0%",
      "font-family": "Sora",
      "font-weight": 600,
      "letter-spacing": "0.5px",
      "text-transform": "uppercase",
      "color": Colors.navy,
      "margin": 0,
      "padding-bottom": 0,
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
  })
);
