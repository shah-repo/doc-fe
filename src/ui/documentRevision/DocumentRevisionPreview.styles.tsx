import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      maxWidth: 1200,
      width: "100%",
      margin: "auto",
      flexGrow: 1,
      alignContent: "center",
    },
    actionButtons: {
      marginTop: theme.spacing.unit * 3,
      borderTop: `1px solid ${theme.palette.grey[600]}`,
      paddingTop: theme.spacing.unit * 3,
      textAlign: "center",
    },
  });
