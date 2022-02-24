import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles((theme) =>
  createStyles({
    noPendingActions: {
      color: "red",
    },
    root: {
      "overflow": "auto",
      "height": "calc(100vh - 192px)",
      "padding-bottom": 0,
    },
    grid: {
      marginTop: 5,
    },
    loadButton: {
      "position": "static",
      "left": "0%",
      "right": "18.54%",
      "top": "0%",
      "bottom": "0%",
      "font-family": "Sora",
      "font-weight": 600,
      "letter-spacing": "0.5px",
      "text-transform": "uppercase",
      "color": " #011FBB",
    },
  })
);
