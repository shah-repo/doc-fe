import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogRoot: {
      pointerEvents: "none",
    },
    dialogContainer: {
      justifyContent: "flex-end",
      alignItems: "flex-start",
    },
    dialogPaper: {
      pointerEvents: "auto",
    },
    // TODO Move to overrides
    titleRoot: {
      display: "flex",
      justifyContent: "space-between",
      padding: theme.spacing(2),
    },
    actionsRoot: {
      padding: theme.spacing(2),
    },
  })
);

export default useStyles;
