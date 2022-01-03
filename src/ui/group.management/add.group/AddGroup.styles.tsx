

import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const AddGroupStyles = makeStyles(() => ({
  Button: {
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
}));

export default AddGroupStyles;
