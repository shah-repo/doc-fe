import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const POStatusToastrStyles = makeStyles((theme) => ({
  listItem: {
    padding: 0,
    margin: 0,
  },
  listItemText: {
    margin: "auto",
  },
  infoIcon: {
    minWidth: 36,
  },
  primaryText: {
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "21px",
    color: Colors.almost_black,
  },
  secondaryLinkText: {
    fontWeight: 600,
    fontSize: "12px",
    color: Colors.almost_black,
  },
  secondaryText: {
    fontWeight: 400,
    fontSize: "12px",
    color: Colors.almost_black,
  },
  message: {
    padding: theme.spacing(0, 2),
    margin: 0,
    color: Colors.almost_black,
  },
  blackDot: {
    width: 4,
    height: 4,
    margin: "3px",
    display: "inline-block",
    background: Colors.almost_black,
  },
}));
export default POStatusToastrStyles;
