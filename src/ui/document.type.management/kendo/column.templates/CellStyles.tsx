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
    marginRight: theme.spacing(1.875),
    paddingRight: theme.spacing(2.5),
    paddingLeft: theme.spacing(2.5),
    fontSize: 12,
    fontWeight: 600,
    color: Colors.navy,
    border: `1px solid ${Colors.gray}`,
    backgroundColor: Colors.white,
    textTransform: "uppercase",
  },
  schemaAddBtn: {
    "fontWeight": 600,
    "margin": 0,
    "boxShadow": "none",
    "borderRadius": 200,
    "background": Colors.navy,
    "color": Colors.white,
    "paddingRight": theme.spacing(2.5),
    "paddingLeft": theme.spacing(2.5),
    "textTransform": "uppercase",
    "&:hover": {
      background: Colors.navy,
    },
    "&:disabled": {
      opacity: .6,
      backgroundColor: Colors.navy,
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
    "padding": theme.spacing(0.625),
  },
}));
export default CellStyles;
