import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    container: {
      margin: "10px 0",
      lineHeight: "23px",
      borderBottom: "1px solid lightgray",
      width: "100%",
      cursor: "pointer",
      padding: "10px",
    },
    title: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      color: "red",
    },
    selected: {
      background: "#fff",
    },
  }),
);
