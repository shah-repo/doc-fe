import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const styles = makeStyles((theme) => ({
  lotButton: {
    "margin": 0,
    "boxShadow": "none",
    "height": "30px",
    "padding": "7.5px 10px",
    "color": Colors.navy,
    "border": `1px solid ${Colors.navy}`,
    "borderRadius": 4,
    "fontWeight": 600,
    "fontSize": 12,
    "&:hover": {
      background: Colors.background_white,
    },
  },
}
));
export default styles;
