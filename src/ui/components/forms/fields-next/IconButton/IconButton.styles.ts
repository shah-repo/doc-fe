import { createStyles, makeStyles } from "@material-ui/core";
import { Colors } from "../../../../layout/theme-next";

export default makeStyles((theme) => createStyles({
  button: {
    padding: 0,
    width: 36,
    height: 36,
    minWidth: 0,
    fontSize: 16,
  },
  square: {
    "width": 30,
    "height": 30,
    "minHeight": 30,
    "color": Colors.textGray,
    "borderRadius": theme.shape.borderRadius / 2,
    "&:hover": {
      color: Colors.textBlack,
      background: Colors.hover,
    },
  },
  boxed: {
    background: Colors.primaryHighlight,
  },
  simple: ({ size }) => ({
    "width": "auto",
    "height": "auto",
    "minHeight": 0,
    "fontSize": size,
    "& svg": {
      height: "1em",
    },
  }),
}));
