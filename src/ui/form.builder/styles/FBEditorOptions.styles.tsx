import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const editorOptionStyles = makeStyles(() =>
  createStyles({
    textfield: {
      "width": 270,
      "borderRadius": 3,
      "& .MuiOutlinedInput-root": {
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
  }));
