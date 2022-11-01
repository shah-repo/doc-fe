import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
      backgroundColor: "white",
    },
    dialogTitle: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
    slackButton: {
      border: "1px solid" + theme.palette.primary.main,
    },
    slackLogo: {
      marginRight: "5px",
    },
    Button: {
      "margin": "0px",
      "boxShadow": "none",
      "borderRadius": 100,
      "background": Colors.navy,
      "color": Colors.white,
      "paddingRight": theme.spacing(2.5),
      "paddingLeft": theme.spacing(2.5),
      "textTransform": "none",
      "&:hover": {
        background: Colors.navy,
      },
    },
    historyButton: {
      "margin": "0 10px",
      "height": "36px",
      "borderRadius": 100,
      "background": Colors.light_blue,
      "color": Colors.navy,
      "fontSize": "12px",
      "justifyContent": "center",
      "alignItems": "center",
      "textTransform": "none",
      "&:hover": {
        background: Colors.light_blue,
      },
    },
  }),
);
