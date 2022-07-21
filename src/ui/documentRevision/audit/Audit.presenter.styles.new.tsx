import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    details: {
      overflowY: "auto",
      maxHeight: "50vw",
    },
    noPaddingMargin: {
      margin: "0px",
      padding: "0px",
    },
    auditListItem: {
      margin: "0px",
      padding: "0px",
      marginBottom: "15px",
    },
    changeContainer: {
      boxShadow: `inset 0px 1px 0px -1px ${Colors.gray_goose}, inset 0px -1px 0px 0px ${Colors.gray_goose}`,
      padding: theme.spacing(1.875),
    },
    auditValue: {
      fontSize: "14px",
      fontFamily: "Sora",
      wordBreak: "break-word",
      color: Colors.almost_black,
    },
    auditKey: {
      fontSize: "12px",
      color: Colors.font_gray,
    },
    owner: {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
    dateContainer: {
      marginBottom: theme.spacing(2),
      color: theme.palette.text.hint,
    },
    revisionContainer: {
      background: Colors.background_blue,
      height: theme.spacing(5),
      paddingTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      borderRadius: theme.spacing(0.4),
    },
    title: {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: theme.spacing(1),
    },
  }),
);
