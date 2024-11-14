import { SelectProps } from '@material-ui/core';
import { FBInputProps, FBOptionProps } from '..';

export type FBSelectProps =
& Pick<SelectProps, 'style' | 'variant' | 'SelectDisplayProps' | 'MenuProps' | 'onOpen' | 'onFocus'>
& FBInputProps
& FBOptionProps
& {
  menuItems?: React.ReactNode[]
  isPlaceholderShown?: boolean
};
