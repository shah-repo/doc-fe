import { makeStyles } from "@material-ui/core";
import Colors from "../../../../ui/layout/theme/utils/colors";

export default makeStyles({
  root: {
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
    left: 0,
    right: 0,
    top: -10,
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
