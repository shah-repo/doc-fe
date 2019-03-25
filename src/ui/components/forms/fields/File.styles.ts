import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.grey[500]}`,
      padding: theme.spacing.unit,
    },
    text: {
      flex: 3,
    },
    button: {
      flex: 1,
    },
  });
