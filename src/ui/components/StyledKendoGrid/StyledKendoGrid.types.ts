import { GridProps } from '@progress/kendo-react-grid';
import { MutableRefObject } from 'react';

export interface StyledKendoGridProps extends GridProps {
  hasBoxScrollbars?: boolean
  containerRef?: MutableRefObject<HTMLDivElement>
}
