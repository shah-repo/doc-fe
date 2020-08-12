import { makeStyles, Theme } from "@material-ui/core";
import Colors from "../../../../layout/theme/utils/colors";
import { AttachmentStyleProps } from "./types";

export const styles = makeStyles((theme: Theme) => ({
  root: ({ isField }: AttachmentStyleProps) => ({
    padding: isField ? theme.spacing(2, 1) : 0,
    backgroundColor: isField ? Colors.white : "transparent",
    borderRadius: isField ? "4px" : "none",
    border: isField ? `1px solid ${Colors.medium_gray}` : "none",
  }),
  link: ({ isField }: AttachmentStyleProps) => ({
    display: isField ? "flex" : "block",
  }),
  button: {
    margin: theme.spacing(1),
    colorInherit: theme.palette.primary.main,
  },
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
