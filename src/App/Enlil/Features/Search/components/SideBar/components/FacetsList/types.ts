import { Facet } from '../../../../types';

export type FacetOnChangeHandler = (item: { id: string, checked: boolean }) => void;

export interface MappedFacet extends Omit<Facet, 'children'> {
  checked: boolean
  children?: MappedFacet[]
}

export interface FacetItemProps {
  facet: MappedFacet
  onChange?: FacetOnChangeHandler
}

export interface FacetsListProps {
  facets: MappedFacet[]
  isChild?: boolean
  onChange?: FacetOnChangeHandler
}
