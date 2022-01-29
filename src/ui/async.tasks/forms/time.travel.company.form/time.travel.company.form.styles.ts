import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";

export const styles = makeStyles((theme) =>
  createStyles({
    root: {
      overflow: "auto",
      height: "calc(100vh - 130px)",
    },
    error: {
      color: Colors.red,
    },
    grid: {
      marginTop: "4px",
    },
    selectedAll: {
      "backgroundColor": "rgba(0, 0, 0, 0.08)",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.08)",
      },
    },
    indeterminateColor: {
      color: "#f50057",
    },
    selectAllText: {
      fontWeight: 500,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    formControl: {
      margin: theme.spacing(1),
      width: 500,
    },
  })
);
