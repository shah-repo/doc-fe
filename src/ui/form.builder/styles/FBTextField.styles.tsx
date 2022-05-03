import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const FBTextFieldStyles = makeStyles(() =>
  createStyles({
    textfield: (rows?) => ({
      "height": rows && rows.rows > 1 ? (rows.rows * 40) : 40,
      "borderRadius": 3,
      "& .MuiOutlinedInput-root": {
        "height": 40,
        "fontFamily": "Sora",
        "fontWeight": 400,
        "fontSize": 14,
        "&.MuiInputBase-multiline": {
          height: 122,
          padding: 0,
        },
        "& fieldset": {
          borderColor: Colors.light_gray_border,
          borderRadius: 3,
        },
      },
      "& .MuiOutlinedInput-input": {
        padding: "13px",
      },
    }),
    error: {
      "& .Mui-error": {
        fontSize: 11,
        fontFamily: "Sora",
      },
    },
  }));
