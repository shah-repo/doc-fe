import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    label: {
      "fontFamily": "Sora",
      "fontStyle": "normal",
      "fontWeight": "normal",
      "fontSize": "14px",
      "lineHeight": "18px",
      "color": Colors.almost_black,
      "&.add_section": {
        color: Colors.navy,
      },
      "cursor": "pointer",
    },
    iconButton: {
      "&:hover": {
        "background": Colors.white,
        "borderRadius": "5px",
        "& svg": {
          "stroke": Colors.almost_black,
          "& rect": {
            fill: Colors.almost_black,
          },
        },
      },
      "& svg": {
        stroke: Colors.font_gray,
      },
      "fontSize": "12px",
      "fontFamily": "Sora",
      "fontStyle": "normal",
      "fontWeight": "normal",
    },
  }));
