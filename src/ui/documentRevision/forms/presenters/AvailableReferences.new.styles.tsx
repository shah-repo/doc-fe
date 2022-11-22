import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    label: {
      color: Colors.almost_black,
      fontSize: "12px",
      fontWeight: 600,
      lineHeight: "15px",
      marginBottom: "8px",
    },
    root: {
      "& .MuiAutocomplete-inputRoot": {
        paddingRight: "30px",
      },
      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
        transform: "translate(14px, 14px) scale(0.75)",
        color: Colors.font_gray,
      },
    },
    chipRoot: {
      "backgroundColor": "transparent",
      "whiteSpace": "normal",
      "borderRadius": 4,
      "margin": "4px 0",
      "height": "auto",
      "display": "flex",
      "padding": 10,
      "justifyContent": "space-between",
      "&:hover": {
        "backgroundColor": Colors.light_blue,
        "& $deleteIcon": {
          visibility: "visible",
        },
      },
      "&:focus": {
        "backgroundColor": Colors.light_blue,
        "& $deleteIcon": {
          visibility: "visible",
        },
      },
    },
    chipLabel: {
      paddingLeft: 0,
    },
    chip: {
      whiteSpace: "normal",
      fontSize: 14,
      color: Colors.navy,
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: 1.28,
    },
    deleteIcon: {
      visibility: "hidden",
      height: 16,
      width: 16,
      flexShrink: 0,
      marginRight: -4,
    },
    option: {
      fontSize: "14px",
      fontFamily: "Sora",
      overflowWrap: "anywhere",
    },
  })
);
