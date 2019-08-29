import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(0, 4, 0, 2),
    },
    details: {
      overflowY: "auto",
      maxHeight: "50vw",
    },
    changeContainer: {
      borderBottom: "1px solid " + theme.palette.text.hint,
      padding: theme.spacing(1),
      background: "#fff",
    },
    auditValue: {
      color: theme.palette.primary.main,
      fontWeight: 500,
    },
    owner: {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
    dateContainer: {
      marginBottom: theme.spacing(2),
      color: theme.palette.text.hint,
    },
  }),
);
