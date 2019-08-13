import { makeStyles } from "@material-ui/core";
import { AttachmentStyleProps } from "./types";

export const styles = makeStyles((theme) => ({
  root: ({ isField }: AttachmentStyleProps) => ({
    padding: theme.spacing(2, 1),
    backgroundColor: isField ? "rgba(0, 0, 0, 0.09)" : "transparent",
  }),
  input: {
    display: "none",
  },
  link: {
    display: "flex",
  },
  icon: ({ isField }: AttachmentStyleProps) => ({
    display: isField ? "inherited" : "none",
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  }),
}));
