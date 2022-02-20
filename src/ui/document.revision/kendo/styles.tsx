import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const commonButtonStyles = {
  "margin": 0,
  "boxShadow": "none",
  "borderRadius": 100,
  "fontFamily": "Sora",
  "text-transform": "capitalize",
};
const KendoGridStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
    height: "66px",
    alignContent: "center",
  },
  kGridRoot: {
    padding: theme.spacing(0, 2.5, 1.25, 2.5),
  },
  kGrid: {
    height: "calc(100vh - 135px)",
  },
  exportListbutton: {
    ...commonButtonStyles,
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    marginRight: theme.spacing(1.875),
    color: Colors.navy,
    border: `1px solid ${Colors.navy}`,
    backgroundColor: Colors.white,
  },
  createDocButton: {
    ...commonButtonStyles,
    "paddingLeft": theme.spacing(2.5),
    "paddingRight": theme.spacing(2.5),
    "background": Colors.navy,
    "color": Colors.white,
    "&:hover": {
      background: Colors.navy,
    },
  },
  iconSvg: {
    fill: Colors.navy,
    marginRight: theme.spacing(0.625),
  },
  title: {
    fontWeight: 600,
    fontSize: 18,
    color: Colors.almost_black,
    textTransform: "capitalize",
    fontFamily: "Sora",
  },
  gridExportCreate: {
    textAlign: "right",
  },
}
));
export default KendoGridStyles;
