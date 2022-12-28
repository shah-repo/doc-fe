import { makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";
import { grayDotStyles, lineItemStyles } from "../common/styles";

export default makeStyles((theme) => ({
  ...lineItemStyles(theme),
  ...grayDotStyles(theme, {
    right: 4,
    marginLeft: 4,
    marginRight: 5,
  }),
  dueOn: {
    fontWeight: "bold",
    fontSize: 13,
    lineHeight: 1.25,
    color: Colors.font_gray,
    letterSpacing: 0,
  },
}));
