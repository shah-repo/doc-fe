import { makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const commonButtonStyles = {
  "margin": 0,
  "boxShadow": "none",
  "borderRadius": 100,
  "text-transform": "capitalize",
};
const styles = makeStyles((theme) => ({
  exportListbutton: {
    ...commonButtonStyles,
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    color: Colors.navy,
    border: `1px solid ${Colors.navy}`,
    backgroundColor: Colors.white,
  },
  disabledIconSvg: {
    fill: Colors.white,
    marginRight: theme.spacing(0.625),
  },
  iconSvg: {
    fill: Colors.navy,
    marginRight: theme.spacing(0.625),
  },
}
));
export default styles;
