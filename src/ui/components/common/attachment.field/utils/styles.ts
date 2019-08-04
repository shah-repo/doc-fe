import { makeStyles } from "@material-ui/core";
import { AttachmentStyleProps } from "./types";

export const styles = makeStyles((theme) => ({
  root: (props: AttachmentStyleProps) => ({
    padding: theme.spacing(2, 1),
    backgroundColor: props.isField ? theme.palette.background.default : "transparent",
  }),
  input: {
    display: "none",
  },
  link: {
    display: "flex",
  },
  icon: (props: AttachmentStyleProps) => ({
    display: props.isField ? "inherited" : "none",
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  }),
}));
