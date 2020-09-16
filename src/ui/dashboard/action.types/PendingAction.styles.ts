
import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    highlight: {
      color: "red",
    },
    actionLink: {
      textDecoration: "none",
      color: "inherit",
    },
    containerWrap: {
      paddingLeft: "42px",
      marginTop: "15px",
      marginBottom: "15px",
    },
    itemWrap: {
      display: "flex",
      justifyContent: "flex-end",
    },
  },
  ));
