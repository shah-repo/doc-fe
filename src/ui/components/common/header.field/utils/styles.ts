import { makeStyles } from "@material-ui/core";
import { HeaderFieldStyleProps } from "./types";

export const styles = makeStyles((theme) => ({
  root: ({ variant }: HeaderFieldStyleProps) => ({
    margin: theme.spacing(3.5, 0, (variant === "regular") ? 0 : -2.5),
  }),
}));
