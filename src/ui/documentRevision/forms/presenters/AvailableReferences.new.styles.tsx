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
      "whiteSpace": "normal",
      "background": Colors.light_blue,
      "borderRadius": "2px",
      "height": "30px",
      "margin": "10px 0",
      "display": "flex",
      "justifyContent": "space-between",
      "& .MuiChip-label": {
        paddingLeft: "6px",
      },
      "&:hover": {
        "& $deleteIcon": {
          visibility: "visible",
        },
      },
    },
    chip: {
      whiteSpace: "normal",
      fontSize: "14px",
      color: Colors.navy,
      fontFamily: "Sora",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "18px",
    },
    deleteIcon: {
      "visibility": "hidden",
      "color": Colors.latest_red_varient,
      "&:hover": {
        color: Colors.latest_red_varient,
      },
    },
    option: {
      fontSize: "14px",
      fontFamily: "Sora",
      overflowWrap: "anywhere",
    },
  })
);
