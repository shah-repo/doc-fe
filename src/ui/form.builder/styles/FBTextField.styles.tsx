import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const FBTextFieldStyles = makeStyles(() =>
  createStyles({
    textfield: (rows?) => ({
      "borderRadius": 3,
      "& .MuiOutlinedInput-root": {
        "height": 40,
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
      },
    },
  }));
