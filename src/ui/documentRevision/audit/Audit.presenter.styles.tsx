import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(0, 2, 0, 0),
    },
    details: {
      overflowY: "auto",
      maxHeight: "50vw",
    },
    changeContainer: {
      borderBottom: "1px solid lightgray",
      padding: theme.spacing(1, 0),
      background: "#fff",
    },
    auditValue: {
      color: theme.palette.primary.main,
      fontWeight: 500,
      wordBreak: "break-word",
    },
    owner: {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
    dateContainer: {
      marginBottom: theme.spacing(2),
      color: theme.palette.text.hint,
    },
    revisionContainer: {
      backgroundColor: theme.palette.primary.light,
      height: theme.spacing(5),
      paddingTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      borderRadius: theme.spacing(0.4),
    },
    title: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: theme.spacing(1),
    },
    list: {
      margin: theme.spacing(0, 1, 0, 1),
    },
  }),
);
