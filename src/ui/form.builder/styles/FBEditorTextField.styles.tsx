import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = makeStyles(() =>
  createStyles({
    textfield: {
      "height": 40,
      "width": 270,
      "borderRadius": 3,
      "background": Colors.red,
      "& .MuiOutlinedInput-root": {
        "height": 40,
        "fontWeight": 400,
        "fontSize": 14,
        "&.MuiInputBase-multiline": {
          height: "122px",
        },
        "& fieldset": {
          borderColor: Colors.light_gray_border,
          borderRadius: 3,
        },
      },
    },
    error: {
      "& .Mui-error": {
        fontSize: 11,
        fontFamily: "Sora",
      },
    },
  }));
