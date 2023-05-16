import { TooltipProps } from '@material-ui/core';

export type FBTooltipProps = Omit<TooltipProps, 'children'> & {
  children?: TooltipProps['children'] | string | number;
};
