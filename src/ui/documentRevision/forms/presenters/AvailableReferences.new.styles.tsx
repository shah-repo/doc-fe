import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    label: {
      color: Colors.almost_black,
      fontSize: "12px",
      fontFamily: "Sora",
      fontWeight: 600,
      lineHeight: "15px",
      marginBottom: "8px",
    },
    root: {
      "& .MuiAutocomplete-inputRoot": {
        paddingRight: "30px",
      },
    },
    chip: {
      whiteSpace: "normal",
      fontSize: "12px",
      fontFamily: "sora",
    },
    option: {
      fontSize: "14px",
      fontFamily: "Sora",
    },
  })
);
