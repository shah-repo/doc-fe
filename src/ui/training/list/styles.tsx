import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      padding: theme.spacing(4, 5),
    },
    container: {
      textAlign: "right",
      marginBottom: theme.spacing(2),
    },
    item: {
      height: "77vh",
      width: "100%",
    },
    clearButton: {
      margin: theme.spacing(0, 2, 0, 0),
      backgroundColor: theme.palette.common.white,
    },
    remainderButton: {
      padding: theme.spacing(0, 1.5),
      margin: theme.spacing(0, 1),
      borderRadius: "10px",
      minWidth: "unset",
      fontSize: "0.65rem",
    },
    triangleDown: {
      "width": "0.65rem",
      "marginLeft": theme.spacing(0.25),
      "&.expanded": {
        transform: "rotate(180deg)",
      },
    },
    button: {
      margin: "0px",
      boxShadow: "none",
      marginRight: theme.spacing(0.625),
    },
    iconSvg: {
      fill: theme.palette.primary.main,
    },
  }),
);
