import { Theme, withStyles } from "@material-ui/core/styles";
import { TextField } from "formik-material-ui";

export const StyledTextField = withStyles((theme: Theme) => ({
  root: {},
}))(TextField);
