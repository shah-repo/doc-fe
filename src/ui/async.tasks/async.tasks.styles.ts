import { createStyles, fade, makeStyles } from "@material-ui/core";
import Colors from "../layout/theme/utils/colors";

export const styles = makeStyles((theme) =>
  createStyles({
    root: {
      overflow: "auto",
      height: "calc(100vh - 130px)",
    },
    error: {
      color: Colors.red,
    },
    selectedAll: {
      "backgroundColor": fade(Colors.black, 0.08),
      "&:hover": {
        backgroundColor: fade(Colors.black, 0.08),
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
      margin: theme.spacing(0.25),
    },
    formControl: {
      margin: theme.spacing(1),
      width: 500,
    },
  })
);
