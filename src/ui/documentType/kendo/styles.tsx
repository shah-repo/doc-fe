import { makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

const GridStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    padding: "0 5px 10px 5px",
  },
  kGrid: {
    height: "calc(100vh - 115px)",
  },
  filterBtn: {
    color: Colors.navy,
  },
  toolBarBtn: {
    margin: "0px",
    boxShadow: "none",
    marginRight: theme.spacing(0.625),
    borderRadius: "100px",
  },
  createDocButton: {
    background: Colors.navy,
  },
  chip: {
    display: "flex",
    flexDirection: "row",
    width: "121px",
    height: "22px",
    borderRadius: "10px",
    background: "grey",
    fontFamily: "Sora",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "12px",
    lineHeight: "22px",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",

  },
  Released: {
    background: Colors.latest_green_varient,
  },
  PendingChange: {
    background: Colors.latest_yellow_varient,
  },
  Draft: {
    background: Colors.font_gray,
  },
  InReview: {
    background: Colors.latest_blue_varient,
    color: Colors.white,
  },
  columnsCus: {
    fontFamily: "Sora",
    fontWeight: "bold",
    fontSize: "14px",
  },
}
));
export default GridStyles;
