import { makeStyles } from "@material-ui/core";
import Colors from "../../../layout/theme/utils/colors";
import { FieldStyleProps } from "./Field";

export const styles = makeStyles((theme) => ({
  typography: ({ error }: FieldStyleProps) => ({
    color: error ? theme.palette.primary.main : Colors.almost_black,
    fontSize: "12px",
    fontFamily: "Sora",
    fontWeight: 600,
  }),
  form: ({ gutter }: FieldStyleProps) => ({
    margin: gutter ? theme.spacing(0, 0, 3.7) : theme.spacing(1, 0, 1),
  }),
}));
