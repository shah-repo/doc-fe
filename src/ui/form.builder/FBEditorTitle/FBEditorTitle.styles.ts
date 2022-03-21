import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    rootContainer: {
      width: "270px",
      height: "52px",
      background: Colors.whitest_grey,
      borderRadius: "100px",
    },
    toggleButtonGroup: {
      position: "absolute",
    },
    button: {
      "textTransform": "none",
      "display": "flex",
      "flexDirection": "row",
      "alignItems": "center",
      "position": "absolute",
      "fontFamily": "Sora",
      "fontStyle": "normal",
      "fontWeight": "bold",
      "fontSize": "14px",
      "top": "5px",
      "lineHeight": "18px",
      "height": "42px",
      "&:hover": {
        borderRadius: "100px",
      },
    },
    config: {
      width: "143px",
      left: "5px",
    },
    validation: {
      width: "105px",
      left: "160px",
    },
    active: {
      color: Colors.navy,
      borderRadius: "100px",
      boxShadow: "0px 2px 5px rgba(204, 212, 217, 0.8)",
      background: Colors.white,
      padding: "12px 24px",
    },
    inactive: {
      border: 0,
      color: Colors.font_gray,
    },
  })
);
