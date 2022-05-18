import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    tooltip: {
      maxHeight: "500px",
      minHeight: "18px",
      overflow: "auto",
      fontSize: 12,
      whiteSpace: "pre-line",
    },
  })
);
