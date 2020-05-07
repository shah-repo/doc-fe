import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      marginBottom: "20px",
    },
    appBar: {
      backgroundColor: "red",
      boxShadow: "none",
      color: "rgba(0, 0, 0, 0.87)",
      zIndex: 99999,
    },
    box: {
      margin: "0px auto",
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
    },
  });
