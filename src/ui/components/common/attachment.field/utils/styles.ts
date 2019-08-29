import { makeStyles } from "@material-ui/core";
import { AttachmentStyleProps } from "./types";

export const styles = makeStyles((theme) => ({
  root: ({ isField }: AttachmentStyleProps) => ({
    padding: isField ? theme.spacing(2, 1) : 0,
    backgroundColor: isField ? "rgba(0, 0, 0, 0.09)" : "transparent",
  }),
  link: ({ isField }: AttachmentStyleProps) => ({
    display: isField ? "flex" : "block",
  }),
  input: {
    display: "none",
  },
  icon: ({ isField }: AttachmentStyleProps) => ({
    display: isField ? "inherited" : "none",
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  }),
}));
