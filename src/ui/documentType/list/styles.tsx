import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

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
    createButton: {
      "margin": "0px",
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
    clearButton: {
      margin: "0px 16px 0px 0px",
      backgroundColor: theme.palette.common.white,
    },
    exportListbutton: {
      margin: "0px",
      boxShadow: "none",
      fontFamily: "Sora",
      fontWeight: 600,
      borderRadius: 100,
      marginRight: 15,
      textTransform: "none",
      paddingRight: 20,
      paddingLeft: 20,
      border: `1px solid ${Colors.navy}`,
      backgroundColor: Colors.white,
      color: Colors.navy,
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
