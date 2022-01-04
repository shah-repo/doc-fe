import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

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
      "margin": 0,
      "boxShadow": "none",
      "borderRadius": 100,
      "background": Colors.navy,
      "color": Colors.white,
      "fontFamily": "Sora",
      "paddingRight": 20,
      "paddingLeft": 20,
      "textTransform": "none",
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
      margin: 0,
      boxShadow: "none",
      borderRadius: 100,
      marginRight: 15,
      textTransform: "none",
      paddingRight: 20,
      paddingLeft: 20,
      fontFamily: "Sora",
      fontSize: 12,
      fontWeight: 600,
      color: Colors.navy,
      border: `1px solid ${Colors.navy}`,
      backgroundColor: Colors.white,
    },
    iconSvg: {
      fill: Colors.navy,
      marginRight: 5,
    },
    title: {
      fontWeight: 700,
      fontSize: 14,
      color: Colors.almost_black,
      textTransform: "uppercase",
      fontFamily: "Sora",
      marginTop: 10,
      marginLeft: 5,
    },
  }),
);
