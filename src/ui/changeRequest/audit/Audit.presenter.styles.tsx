import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: "0 30px",
    },
    collapsableButton: {
      width: "100%",
      borderRadius: 0,
      justifyContent: "end",
    },
    collapsableContainer: {
      maxHeight: 700,
      overflowY: "auto",
    },
    changeContainer: {
      borderBottom: "1px solid lightgray",
      margin: "0 5px 5px",
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
      marginBottom: 10,
      color: theme.palette.text.hint,
    },
  }),
);
