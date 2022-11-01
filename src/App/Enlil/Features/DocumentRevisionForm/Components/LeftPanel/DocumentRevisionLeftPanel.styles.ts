import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../../../ui/layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    titleText: {
      "font-weight": "600",
      "font-size": "12px",
      "color": Colors.dark_jungle_green,
    },
  })
);
