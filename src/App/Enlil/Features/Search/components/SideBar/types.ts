import { Facet } from '../../types';

export interface SideBarProps {
  query?: string
  facets?: Facet[]
  onChange?: (data: string[]) => void
}
