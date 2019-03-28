import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      margin: "auto",
      marginTop: theme.spacing.unit * 3,
      maxWidth: 1024,
      width: "100%",
      paddingBottom: theme.spacing.unit * 3,
    },
    reviewButton: {
      marginTop: theme.spacing.unit * 3,
      borderTop: `1px solid ${theme.palette.grey[600]}`,
      paddingTop: theme.spacing.unit * 3,
      textAlign: "center",
    },
  });
