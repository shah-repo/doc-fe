import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";

interface StylesProps {
  mt: number;
  mb: number;
  isDragged?: boolean;
}

export default makeStyles((theme: Theme) =>
  createStyles({
    root: ({ mt, mb }: StylesProps) => ({
      position: "relative",
      marginTop: theme.spacing(mt),
      marginBottom: theme.spacing(mb),
    }),
    field: {
      position: "relative",
      // marginBottom: "60px",
    },
    tools: ({ isDragged }: StylesProps) => ({
      position: "absolute",
      inset: theme.spacing(-1, -1, -1, -1),
      borderRadius: theme.shape.borderRadius,
      borderTopRightRadius: 0,
      outline: `2px solid ${Colors.dodger_blue}`,
      outlineOffset: -2,
      backgroundColor: isDragged ? Colors.alabaster : "",
      boxShadow: isDragged ? theme.shadows[5] : "",
    }),
  })
);
