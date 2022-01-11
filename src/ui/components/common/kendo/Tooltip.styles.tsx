import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    tooltip: {
      maxHeight: "calc(100vh - 700px)",
      minHeight: "18px",
      overflow: "auto",
      fontFamily: "Sora",
      fontSize: 12,
      whiteSpace: "pre-line",
    },
  })
);
