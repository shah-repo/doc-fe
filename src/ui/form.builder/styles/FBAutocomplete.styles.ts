import { createStyles, makeStyles } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

export const styles = {
  inputPropStyle: {
    minHeight: 40,
    background: Colors.white,
    border: `1px solid ${Colors.gray_goose}`,
    borderRadius: 3,
    padding: "0 80px 0 6px",
  },
  labelProps: {
    marginBottom: 10,
    fontFamily: "Sora",
    fontWeight: 600,
    fontSize: 12,
    color: Colors.almost_black,
  },
  labelStyle: {
    fontFamily: "Sora",
    fontWeight: 600,
    fontSize: 12,
    color: Colors.almost_black,
  },
  labelFont: {
    fontFamily: "Sora",
    fontSize: 14,
  },
};


export const FBAutoCompleteStyle = makeStyles(() =>
  createStyles({
    root: {
      "& .MuiAutocomplete-inputRoot": {
        padding: 0,
      },
      "& input": {
        fontSize: "12px",
        fontFamily: "Sora",
        color: Colors.almost_black,
      },
    },
  })
);
