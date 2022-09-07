
import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const FBTableCellStyles = makeStyles(() =>
  createStyles({
    cellFont: {
      color: Colors.almost_black,
      fontFamily: "Sora",
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
    },
    cellBackground: {
      fontWeight: 600,
      background: Colors.whitest_grey,
      border: `1px solid ${Colors.whitest_grey}`,
      borderRadius: "3px",
    },
    headerCellText: {
      fontSize: "12px",
      fontWeight: 400,
      color: Colors.almost_black,
      paddingLeft: 7,
    },
    cellHeader: {
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "18px",
      color: Colors.almost_black,
    },
    cellValueHeight: {
      height: "25px",
    },
    cell: {
      background: Colors.white,
    },
    cellEmpty: {
      borderBottom: 0,
    },
  }));
