import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(1),
    },
    linkContainer: {
      borderBottom: "1px solid " + theme.palette.text.hint,
      padding: theme.spacing(2),
    },
    linkTitle: {
      color: theme.palette.text.primary,
      textDecoration: "none",
      fontWeight: 500,
    },
    activeLinkTitle: {
      color: theme.palette.primary.main,
      background: "#f0f0f0",
    },
    linkBody: {
      textDecoration: "none",
      color: "gray",
      lineHeight: "25px",
    },
  }),
);
