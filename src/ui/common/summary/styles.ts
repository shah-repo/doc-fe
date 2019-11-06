import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    descriptionContainer: {
      "border": "0 !important",
      "maxHeight": "36em",
      "width": "100%",
      "overflowY": "auto",
      "margin": theme.spacing(1) + "px 0 " + theme.spacing(3) + "px",
      "&.ql-container.ql-snow": {
        "border": 0,
        "& .ql-editor": {
          padding: 0,
          fontFamily: "Open Sans, sans-serif",
          color: "#474747 !important",
        },
      },
    },
  });
