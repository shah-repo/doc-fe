import { makeStyles } from "@material-ui/core";
import { HeaderFieldStyleProps } from "./types";

export const styles = makeStyles((theme) => ({
  toolbar: ({ size }: HeaderFieldStyleProps) => ({
    minHeight: "20px",
    height: "20px",
  }),
}));
