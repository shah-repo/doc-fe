import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    outerContainer: {
      width: "100%",
      padding: "15px 15px 15px 20px",
      boxShadow: `0px 1px 0px ${Colors.link_water}`,
      margin: "1px 0",
    },
  })
);
