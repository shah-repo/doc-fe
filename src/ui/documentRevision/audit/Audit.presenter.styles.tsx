import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginLeft: 30,
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
      marginBottom: 5,
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
