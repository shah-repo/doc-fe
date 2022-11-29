import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const commonButtonStyles = {
  "margin": 0,
  "boxShadow": "none",
  "borderRadius": 100,
  "text-transform": "capitalize",
};
export const styles = makeStyles((theme: Theme) =>
  createStyles({
    submitButton: {
      background: Colors.medium_blue,
      color: Colors.white,
      boxShadow: "none",
      margin: 0,
    },
    cancelButton: {
      background: Colors.light_blue,
      color: Colors.medium_blue,
      boxShadow: "none",
      margin: 0,
    },
    dialogPaper: {
      overflowY: "unset",
      minWidth: "400px",
    },
    dialogContent: {
      overflowY: "unset",
    },
    createButton: {
      ...commonButtonStyles,
      "paddingRight": theme.spacing(2.5),
      "paddingLeft": theme.spacing(2.5),
      "background": Colors.navy,
      "color": Colors.white,
      "&:hover": {
        background: Colors.navy,
      },
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
      ...commonButtonStyles,
      paddingRight: theme.spacing(2.5),
      paddingLeft: theme.spacing(2.5),
      marginRight: theme.spacing(1.875),
      color: Colors.navy,
      border: `1px solid ${Colors.navy}`,
      backgroundColor: Colors.white,
    },
    iconSvg: {
      fill: Colors.navy,
      marginRight: theme.spacing(0.625),
    },
    disabledIconSvg: {
      fill: Colors.white,
      marginRight: theme.spacing(0.625),
    },
  }),
);
