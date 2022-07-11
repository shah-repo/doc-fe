import { ComponentsProps } from "@material-ui/core/styles/props";

export const muiSelectMenuPaperClassName = "CustomMuiSelectMenuPaper";

export default function themeProps(): ComponentsProps {
  return {
    MuiSelect: {
      MenuProps: {
        elevation: 3,
        PaperProps: {
          className: muiSelectMenuPaperClassName,
        },
      },
    },
  };
}
