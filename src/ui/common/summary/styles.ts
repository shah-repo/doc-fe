import { createStyles, Theme } from "@material-ui/core";

export default (theme: Theme) =>
  createStyles({
    descriptionContainer: {
      border: "0 !important",
      maxHeight: "36em",
      width: "100%",
      overflowY: "auto",
    },
  });
