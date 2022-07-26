import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    closeIcon: { padding: 0 },
    dialogContent: { width: 500 },
    formControl: { width: "100%" },
  })
);
