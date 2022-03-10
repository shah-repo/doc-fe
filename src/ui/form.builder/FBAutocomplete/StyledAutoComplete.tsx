import { withStyles } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

export const StyledAutoComplete = withStyles((theme) => ({
  endAdornment: {
    paddingRight: "28px",
  },
}))(Autocomplete);
