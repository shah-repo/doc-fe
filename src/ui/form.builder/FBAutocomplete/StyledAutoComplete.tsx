import { Chip, withStyles } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

export const StyledAutoComplete = withStyles((theme) => ({
  endAdornment: {
    paddingRight: "28px",
  },
}))(Autocomplete);

export const StyledChip = withStyles((theme) => ({
  label: {
    paddingTop: "5px",
    paddingBottom: "5px",
  },
}))(Chip);
