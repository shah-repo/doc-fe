import { ComponentsProps } from "@material-ui/core/styles/props";
import Colors from "./utils/colors";
import { makeStyles, createStyles } from "@material-ui/core";

const styles = makeStyles(() => createStyles({
  selectMenuPaper: {
    outline: `1px solid ${Colors.mild_wind_blue}`,
  },
}));

export default function themeProps(): ComponentsProps {
  const classes = styles();

  return {
    MuiSelect: {
      MenuProps: {
        elevation: 3,
        PaperProps: {
          className: classes.selectMenuPaper,
        },
      },
    },
  };
}
