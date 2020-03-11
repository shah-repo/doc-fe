import { createStyles, makeStyles, Theme } from "@material-ui/core";

export default makeStyles((theme: Theme) =>
  createStyles({
    buttonDisabled: {
      display: "none",
      width: "196px",
      height: "98px",
      border: "none",
      backgroundColor: "rgba(0,0,0,0.5)",
      borderBottomRightRadius: "196px",
      borderBottomLeftRadius: "196px",
      outline: "none",
      cursor: "pointer",
    },
    buttonEnabled: {
      "display": "flex",
      "justifyContent": "center",
      "align-items": "center",
    },
    link: {
      "color": "#fff",
      "fontFamily": "Open Sans, sans-serif",
      "fontSize": "15px",
      "fontWeight": "bold",
      "textTransform": "uppercase",
      "cursor": "pointer",
      "&.MuiLink-underlineHover": {
        textDecoration: "none",
      },
    },
  }),
);
