
import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const FBTableCellStyles = makeStyles(() =>
  createStyles({
    cellFont: {
      color: Colors.almost_black,
      fontFamily: "Sora",
      fontStyle: "normal",
    },
    cellFontWeightLow: {
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "15px",
    },
    cellFontWeightHigh: {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "18px",
      fontFamily: "Sora",
    },
    cellBackground: {
      fontWeight: 600,
      background: Colors.whitest_grey,
      border: `1px solid ${Colors.whitest_grey}`,
      borderRadius: "3px",
    },
  }));
