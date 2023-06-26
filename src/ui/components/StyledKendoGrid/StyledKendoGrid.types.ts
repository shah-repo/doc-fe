import { GridProps } from '@progress/kendo-react-grid';
import { RefObject } from 'react';

export interface StyledKendoGridProps extends GridProps {
  hasBoxScrollbars?: boolean
  containerRef?: RefObject<HTMLDivElement>
}
