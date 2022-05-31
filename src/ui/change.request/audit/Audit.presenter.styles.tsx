import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      visibility: "hidden",
    },
    details: {
      overflowY: "auto",
      maxHeight: "50vw",
    },
    changeContainer: {
      borderBottom: "1px solid " + theme.palette.text.hint,
      padding: 16,
      background: Colors.white,
    },
    auditValue: {
      color: Colors.almost_black,
      fontWeight: 500,
      wordBreak: "break-word",
      fontSize: "14px",
      fontFamily: "Sora",
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
    auditKey: {
      fontSize: "12px",
      fontFamily: "Sora",
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
  }),
);
