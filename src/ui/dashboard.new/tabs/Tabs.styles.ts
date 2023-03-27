import { makeStyles } from "@material-ui/core";
import { Colors } from "../../layout/theme-next";

export default makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.spacing(1),
  },
  tabs: {
    flexGrow: 1,
    overflow: "auto",
  },
  tabItemIcon: {
    "& path": {
      fill: Colors.textGray,
    },
  },
  tabItemIconActive: {
    "& path": {
      fill: Colors.textBlack,
    },
  },
  tabItemTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 400,
    letterSpacing: 0.25,
  },
  tabItemTitleActive: {
    fontWeight: 600,
  },
  tabItemCount: {
    fontSize: 14,
    fontWeight: 400,
    marginLeft: 5,
  },
}));
