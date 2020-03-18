import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      backgroundColor: theme.palette.grey[200],
      borderRadius: "2px",
      padding: "5px",
      marginRight: "5px",
      marginLeft: 0,
      marginBottom: "5px",
      width: "max-content",
    },
  }),
);
