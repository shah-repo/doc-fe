import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {

    },
    linkContainer: {
      borderBottom: `1px solid ${theme.palette.text.hint}`,
      padding: theme.spacing(2),
      width: theme.spacing(27),
    },
    linkTitle: {
      color: theme.palette.text.primary,
      textDecoration: "none",
      fontWeight: theme.typography.fontWeightBold,
    },
    activeLinkTitle: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
    },
    linkBody: {
      textDecoration: "none",
      color: theme.palette.text.primary,
      lineHeight: "25px",
    },
    selected: {
      background: Colors.background_blue,
    },
    details: {
      "&.MuiExpansionPanelDetails-root": {
        display: "block",
      },
    },
  }),
);
