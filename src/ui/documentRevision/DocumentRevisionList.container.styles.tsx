import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {

    },
    linkContainer: {
      borderBottom: `1px solid ${theme.palette.text.hint}`,
      padding: theme.spacing(2),
      width: theme.spacing(31.5),
      flexGrow: 1,
    },
    linkTitle: {
      color: Colors.dark_blue,
      textDecoration: "none",
      fontWeight: 500,
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
    displayStatus: {
      fontFamily: "Sora",
      fontStyle: "normal",
      fontSize: "14px",
      fontWeight: "normal",
    },
  }),
);
