import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const FBFontStyles = makeStyles(() =>
  createStyles({
    font: {
      fontFamily: "Sora",
    },
  }));

export const FBFontStyle =  {
  font: {
    fontFamily: "Sora",
  },
  labelProps: {
    fontFamily: "Sora",
    fontWeight: 600,
    fontSize: 12,
    color: Colors.almost_black,
    lineHeight: "15px",
  },
};
