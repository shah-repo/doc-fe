import { makeStyles } from "@material-ui/core";
import { Colors } from "../../../../layout/theme-next";

export default makeStyles((theme) => ({
  icon: {
    borderRadius: theme.shape.borderRadius / 2,
    width: 18,
    height: 18,
    border: `2px solid ${Colors.textBlack}`,
    backgroundColor: Colors.white,
    color: Colors.whiteDimmed,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',

    '$root.Mui-focusVisible &': {
      backgroundColor: Colors.gray,
    },
    'input:hover ~ &': {
      backgroundColor: Colors.gray,
    },
    'input:disabled ~ &': {
      backgroundColor: Colors.hover,
      borderColor: Colors.buttonDisabled,
    },
  },
  checkedIcon: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
    color: Colors.white,

    'input:hover ~ &': {
      backgroundColor: Colors.primaryDark,
    },
    '$root.Mui-focusVisible &': {
      backgroundColor: Colors.primaryDark,
    },
    'input:disabled ~ &': {
      backgroundColor: Colors.buttonDisabled,
    },
  },
}));
