

import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const AddGroupStyles = makeStyles((theme: Theme) => ({
  Button: {
    "margin": 0,
    "boxShadow": "none",
    "borderRadius": 100,
    "background": Colors.navy,
    "color": Colors.white,
    "fontFamily": "Sora",
    "paddingRight": theme.spacing(2.5),
    "paddingLeft": theme.spacing(2.5),
    "textTransform": "none",
    "&:hover": {
      background: Colors.navy,
    },
  },
}));

export default AddGroupStyles;
