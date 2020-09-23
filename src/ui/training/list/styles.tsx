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
    clearButton: {
      margin: "0px 16px 0px 0px",
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
      "marginLeft": "2px",
      "&.expanded": {
        transform: "rotate(180deg)",
      },
    },
    button: {
      margin: "0px",
      boxShadow: "none",
    },
    iconSvg: {
      fill: theme.palette.primary.main,
    },
  }),
);
