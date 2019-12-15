import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    addGroupsButton: {
      width: "auto",
      margin: theme.spacing(2.5, 0, 0, 0),
      padding: theme.spacing(0),
    },
    containedButton: {
      width: "auto",
      marginLeft: theme.spacing(0),
      color: "#fff",
      backgroundColor: "#6E09EA",
    },
    outlinedButton: {
      width: "auto",
      color: "#6E09EA",
      borderColor: "#6E09EA",
    },
  }),
);
