import { Chip, withStyles } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Colors from "../../layout/theme/utils/colors";

export const StyledAutoComplete = withStyles((theme) => ({
  endAdornment: {
    paddingRight: "28px",
  },
  paper: {
    boxSizing: "border-box",
    padding: "0px",
    background: Colors.white,
    border: `1px solid ${Colors.gray_goose}`,
    boxShadow: "0px 10px 30px rgba(22, 34, 41, 0.04)",
    borderRadius: "4px",
  },
}))(Autocomplete);

export const StyledPopupAutoComplete = withStyles((theme) => ({
  endAdornment: {
    paddingRight: "5px",
  },
  paper: {
    boxSizing: "border-box",
    padding: "0px",
    background: Colors.white,
    border: `1px solid ${Colors.gray_goose}`,
    boxShadow: "0px 10px 30px rgba(22, 34, 41, 0.04)",
    borderRadius: "4px",

  },
}))(Autocomplete);

export const StyledChip = withStyles((theme) => ({
  label: {
    paddingTop: "5px",
    paddingBottom: "5px",
  },
}))(Chip);
