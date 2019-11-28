import { makeStyles } from "@material-ui/core";
import { FieldStyleProps } from "../../Field";

export const styles = makeStyles((theme) => ({
  root: ({ gutter }: FieldStyleProps) => ({
    margin: gutter ? theme.spacing(1, 0, 4.2) : theme.spacing(1, 0, 0),
    display: "grid",
  }),
  textField: {
    "gridArea": "1/1",
    "width": "100%",
    "background": "transparent",
    "borderRadius": 0,
    "position": "relative",
    "zIndex": 2,
    "& textarea": {
      background: "#fff",
    },
  },
  selectField: {
    "gridArea": "1/1",
    "position": "relative",
    "width": "100%",
    "z-index": "1",
    "top": "25px",
    "border": 0,
    "& .MuiBox-root": {
      visibility: "hidden",
    },
    "& .Mui-error": {
      display: "none",
    },
    "& [class*=\"-option\"]": {
      color: "#000",
    },
  },
}));
