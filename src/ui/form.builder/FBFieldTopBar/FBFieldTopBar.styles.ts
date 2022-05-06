import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles(() =>
  createStyles({
    toolsBox: {
      padding: "8px",
      width: "128px",
      height: "35px",
      background: Colors.dodger_blue,
      borderRadius: "6px 6px 0px 0px",
      cursor: "pointer",
      marginBottom: "-10px",
    },
  })
);
