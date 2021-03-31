import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    iconButton: {
      "padding": theme.spacing(1),
      "&:hover": {
        "background": Colors.background_blue,
        "borderRadius": theme.spacing(0.5),
        "& svg": {
          stroke: Colors.medium_blue,
          color: Colors.medium_blue,
        },
      },
      "& svg": {
        stroke: Colors.hint_gray,
      },
    },
    avatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      marginRight: theme.spacing(2),
    },
  })
);
