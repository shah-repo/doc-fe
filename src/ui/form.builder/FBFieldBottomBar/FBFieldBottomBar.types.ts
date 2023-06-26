import { FBStarterProps } from '..';
import { FBInputProps } from '../types/common';

export type FBFieldBottomBarProps =
  & Pick<FBInputProps, 'index'>
  & FBStarterProps
  & { label?: string };
