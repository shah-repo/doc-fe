import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme) =>
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
      "background": Colors.light_blue,
      "borderRadius": "2px",
      "height": "30px",
      "margin": "10px 0",
      "display": "flex",
      "justifyContent": "space-between",
      "overflow": "hidden",
      "position": "relative",
      "& .MuiChip-label": {
        paddingLeft: "6px",
      },
      "&:focus": {
        backgroundColor: Colors.light_blue,
      },
      "&:active": {
        backgroundColor: Colors.light_blue,
      },
      "&:hover": {
        "& $deleteIcon": {
          opacity: 1,
          transform: "translateX(0)",
        },
        "& $chip": {
          marginRight: theme.spacing(2),
        },
      },
    },
    chip: {
      "fontSize": 14,
      "fontWeight": 400,
      "lineHeight": 1.3,
      "color": Colors.navy,
      "whiteSpace": "nowrap",
      "overflow": "hidden",
      "textOverflow": "ellipsis",
      "display": "block",
      "textDecoration": "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    deleteIcon: {
      "opacity": 0,
      "height": "14px",
      "width": "13px",
      "flexShrink": 0,
      "position": "absolute",
      "right": 0,
      "transform": "translateX(100%)",
      "transition": theme.transitions.create(["opacity", "transform"], { duration: 200 }),
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
