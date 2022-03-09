import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {

    },
    details: {
      overflowY: "auto",
      maxHeight: "50vw",
      marginLeft: "15px",
    },
    changeContainer: {
      borderBottom: "1px solid lightgray",
      padding: theme.spacing(1),
      background: "#fff",
    },
    auditValue: {
      color: theme.palette.primary.main,
      fontWeight: 500,
      wordBreak: "break-word",
    },
    owner: {
      color: theme.palette.text.primary,
      fontWeight: 500,
    },
    dateContainer: {
      marginBottom: theme.spacing(2),
      color: theme.palette.text.hint,
    },
    selectContainer: {
      display: "flex",
      marginTop: 16,
      marginBottom: 16,
      padding: 5,
      background: Colors.light_blue,
      borderRadius: 2,
    },
    accessButton: {
      "padding": 0,
      "margin": 0,
      "border": 0,
      "backgroundColor": "transparent",
      "cursor": "pointer",
      "li.active > a": {
        borderBottom: `1px solid ${theme.palette.common.white}`,
        transition: "none",
      },
    },
  }),
);
