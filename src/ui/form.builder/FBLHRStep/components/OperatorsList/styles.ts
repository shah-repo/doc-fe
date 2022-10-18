import { makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export default makeStyles(() => ({
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  listItemText: {
    marginLeft: 4,
  },
  operatorTitle: {
    fontWeight: 700,
    fontSize: 14,
    color: Colors.almost_black,
  },
  operatorStatus: {
    marginRight: 2,
    fontSize: 14,
    fontWeight: 400,
    color: Colors.almost_black,
    marginTop: 10,
    textTransform: "capitalize",
  },
  avatar: {
    width: 45,
    height: 45,
    fontWeight: 600,
    color: Colors.white,
    borderRadius: "50%",
    fontSize: "12px",
  },
}));
