import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: "10px 0",
      lineHeight: "23px",
      borderBottom: "1px solid " + theme.palette.text.hint,
      width: "100%",
      cursor: "pointer",
      padding: "10px",
    },
    item: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightBold,
    },
    itemSelected: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
    },
    selected: {
      background: theme.palette.primary.light,
    },
  }),
);
