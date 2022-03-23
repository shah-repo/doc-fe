import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../../../../ui/layout/theme/utils/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    searchBox: {
      "height": "36px",
      "width": 270,
      "borderRadius": "100px",
      "border": `1px solid ${Colors.lightest_grey1}`,
      "boxSizing": "border-box",
      "paddingTop": "2px",
      "& .MuiInputBase-root": {
        width: "220px",
      },
    },
    searchIcon: {
      color: Colors.navy,
      margin: "2px 0px 0px 8px",
      fontSize: "20px",
    },
  })
);
