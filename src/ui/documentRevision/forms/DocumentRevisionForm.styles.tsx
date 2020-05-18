import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      margin: "auto",
      width: "100%",
      padding: theme.spacing(2, 5),
      background: "#F2F4F6",
    },
    reviewButton: {
      marginTop: theme.spacing(3),
      borderTop: `1px solid ${theme.palette.grey[600]}`,
      paddingTop: theme.spacing(3),
      textAlign: "center",
    },
  });
