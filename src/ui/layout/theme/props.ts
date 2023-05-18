import { ComponentsProps } from '@material-ui/core/styles/props';

export default function themeProps(): ComponentsProps {
  return {
    MuiSelect: {
      MenuProps: {
        elevation: 3,
      },
    },
  };
}
