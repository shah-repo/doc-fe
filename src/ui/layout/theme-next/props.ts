import { Theme } from "@material-ui/core";
import { ComponentsProps } from "@material-ui/core/styles/props";

const props = (theme: Theme): ComponentsProps => ({
  MuiMenu: {
    elevation: 2,
    MenuListProps: {
      disablePadding: true,
    },
  },
  MuiButtonBase: {
    disableRipple: true,
  },
  MuiDialogTitle: {
    disableTypography: true,
  },
  MuiDialog: {
    PaperProps: {
      elevation: 3,
    },
  },
});

export default props;
