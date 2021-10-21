import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    listitem: {
      "display": "flex",
      "flexDirection": "row",
      "alignItems": "center",
      "padding": "10px 10px 10px 5px",
      "position": "relative",
      "width": "790px",
      "height": "53px",
      "background": Colors.white,
      "&:hover": {
        background: Colors.background_white,
      },
    },
    titletext: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "22px",
      color: Colors.font_black,
    },
  })
);
