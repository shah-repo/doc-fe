import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export default makeStyles((theme: Theme) => ({
  root: {
    position: "relative",
  },
  tools: {
    position: "absolute",
    inset: theme.spacing(-1, -1, -1, -1),
    borderRadius: theme.shape.borderRadius,
    borderTopRightRadius: 0,
    outline: `2px solid ${Colors.dodger_blue}`,
    outlineOffset: -2,
    zIndex: 3,
  },
}));
