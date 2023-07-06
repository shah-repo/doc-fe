import React from 'react';
import { Facet } from '../../types';

export interface SideBarProps {
  checkedFacets: string[]
  facets: Facet[]
  onChange: React.Dispatch<React.SetStateAction<string[]>>
}
