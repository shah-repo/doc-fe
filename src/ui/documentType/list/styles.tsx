import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      padding: theme.spacing(4, 5),
    },
    item: {
      height: "77vh",
      width: "100%",
    },
    link: {
      textDecoration: "none",
    },
    button: {
      margin: "0px",
      boxShadow: "none",
    },
    clearButton: {
      margin: "0px 16px 0px 0px",
      backgroundColor: theme.palette.common.white,
    },
    exportListbutton: {
      margin: "0px",
      boxShadow: "none",
    },
    iconSvg: {
      fill: theme.palette.primary.main,
    },
  }),
);
