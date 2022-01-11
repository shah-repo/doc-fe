import { makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

const CellStyles = makeStyles((theme) => ({
  topButton: {
    display: "flex",
    alignItems: "center",
  },
  dot: {
    height: theme.spacing(0.75),
    width: theme.spacing(0.75),
    borderRadius: "50%",
  },
  Active: {
    background: Colors.latest_green_varient,
  },
  Inactive: {
    background: Colors.grey_cloud,
  },
  value: {
    margin: theme.spacing(0.625),
  },
  schemaCancelBtn: {
    margin: 0,
    boxShadow: "none",
    borderRadius: 200,
    marginRight: 15,
    textTransform: "uppercase",
    paddingRight: 20,
    paddingLeft: 20,
    fontFamily: "Sora",
    fontSize: 12,
    fontWeight: 600,
    color: Colors.navy,
    border: `1px solid ${Colors.gray}`,
    backgroundColor: Colors.white,
  },
  schemaAddBtn: {
    "fontWeight": 600,
    "margin": 0,
    "boxShadow": "none",
    "borderRadius": 200,
    "background": Colors.navy,
    "color": Colors.white,
    "fontFamily": "Sora",
    "paddingRight": 20,
    "paddingLeft": 20,
    "textTransform": "uppercase",
    "&:hover": {
      background: Colors.navy,
    },
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 3,
    color: theme.palette.grey[500],
  },
  ButtonColor: {
    color: Colors.navy,
  },
  Cancel: {
    color: Colors.latest_yellow_varient,
  },
  Remove: {
    color: Colors.latest_red_varient,
  },
  iconButton: {
    "&:hover": {
      backgroundColor: "transparent",
    },
    "padding": 5,
  },
}));
export default CellStyles;
