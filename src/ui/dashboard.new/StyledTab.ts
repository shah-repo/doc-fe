import { Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Colors from "../layout/theme/utils/colors";

const styles = () => ({
  root: {
    "text-transform": "capitalize",
    "minWidth": "125px",
    "color": Colors.font_gray,
    "borderRadius": "100px",
    "right": "0%",
    "top": "10%",
    "bottom": "10%",
    "fontFamily": "Sora",
    "fontStyle": "normal",
    "font-weight": "normal",
    "fontSize": "18px",
    "lineHeight": "23px",
    /* identical to box height */
    "display": "flex",
    "alignItems": "center",
    "letterSpacing": "0.25px",
  },
  selected: {
    "opacity": 1,
    /* Enlil Navy */
    "color": Colors.navy,
    "font-weight": 600,
    "backgroundColor": Colors.sky_blue,
  },
});

export const StyledTab = withStyles(styles)(Tab);
