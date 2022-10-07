import { makeStyles } from "@material-ui/core";
import Colors from "../../../../ui/layout/theme/utils/colors";

export default makeStyles({
  root: {
    overflowY: "scroll",
    backgroundColor: Colors.alabaster,
  },
  tabs: {
    zIndex: 4,
    backgroundColor: Colors.alabaster,
    height: "auto",
    width: "100%",
    fontSize: 12,
    padding: 0,
    borderBottom: `1px solid ${Colors.chinese_silver}`,
    minHeight: 44,
    maxHeight: 44,
    position: "sticky",
  },
  tabheader: {
    top: 0,
    overflowY: "unset",
  },
  tab: {
    width: "auto",
    minWidth: 40,
    padding: 0,
    marginRight: 30,
  },
  indicator: {
    background: Colors.cerulean,
  },
});
