import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { Colors } from "../../../../layout/theme-next";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(2, 0),
    },
    chip: {
      "display": "flex",
      "flexDirection": "row",
      "padding": theme.spacing(.625, 0),
      "borderRadius": 2,
      "background": Colors.primaryBg,
      "alignItems": "center",
      "justifyContent": "center",
      "color": Colors.textBlack,
      "cursor": "pointer",
      "fontWeight": 400,
      "fontSize": "12px",
      "lineHeight": "15px",
      "margin": theme.spacing(.5),
      "& .MuiChip-label.MuiChip-labelSmall": {
        padding: theme.spacing(0, .75),
      },
    },
    chipContainer: {
      maxWidth: "-webkit-fill-available",
    },
  }),
);
