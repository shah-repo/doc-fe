import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    dialogPaper: {
      overflowY: "unset",
      minWidth: "400px",
    },
    dialogContent: {
      overflowY: "unset",
    },
    createButton: {
      margin: "0px",
      boxShadow: "none",
    },
    templateRadioGroup: {
      maxHeight: "500px",
      overflowY: "auto",
      width: "100%",
      flexWrap: "unset",
      WebkitFlexWrap: "unset",
      marginBottom: "10px",
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
