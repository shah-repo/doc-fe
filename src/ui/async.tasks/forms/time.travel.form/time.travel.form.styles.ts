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
      marginTop: theme.spacing(4),
    },
    selectedAll: {
      "backgroundColor": Colors.black, "opacity": 8,
      "&:hover": {
        backgroundColor: Colors.black, opacity: 8,
      },
    },
    indeterminateColor: {
      color: Colors.pink_red,
    },
    selectAllText: {
      fontWeight: 500,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      width: 500,
    },
  })
);
