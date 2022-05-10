import { makeStyles } from "@material-ui/core";
import { FieldStyleProps } from "./Field";

export const styles = makeStyles((theme) => ({
  typography: ({ error }: FieldStyleProps) => ({
    color: error ? theme.palette.primary.main : theme.typography.h4.color,
  }),
  form: ({ gutter }: FieldStyleProps) => ({
    margin: gutter ? theme.spacing(0, 0, 2.5) : theme.spacing(1, 0, 1),
  }),
}));
