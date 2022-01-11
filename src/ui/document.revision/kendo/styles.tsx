import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const commonButtonStyles = {
  "margin": 0,
  "boxShadow": "none",
  "borderRadius": 100,
  "fontFamily": "Sora",
  "text-transform": "none",
};
const KendoGridStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 0.625, 1.25, 0.625),
  },
  kGrid: {
    height: "calc(100vh - 99px)",
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
    fontWeight: 700,
    fontSize: 14,
    color: Colors.almost_black,
    textTransform: "uppercase",
    fontFamily: "Sora",
    marginTop: theme.spacing(1.25),
    marginLeft: theme.spacing(0.625),
  },
  gridExportCreate: {
    textAlign: "right",
    marginBottom: theme.spacing(1.25),
  },
}
));
export default KendoGridStyles;
