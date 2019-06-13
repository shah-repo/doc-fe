import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      margin: "auto",
      marginTop: theme.spacing(3),
      maxWidth: 1024,
      width: "100%",
      paddingBottom: theme.spacing(3),
    },
    reviewButton: {
      marginTop: theme.spacing(3),
      borderTop: `1px solid ${theme.palette.grey[600]}`,
      paddingTop: theme.spacing(3),
      textAlign: "center",
    },
  });
