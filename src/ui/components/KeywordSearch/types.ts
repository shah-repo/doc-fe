import { CompositeFilterDescriptor, FilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { createContext, Dispatch, SetStateAction } from 'react';

export type QueryType = string | undefined;

interface Payload {
  documentTypeWithoutCategory?: string
  limit?: number
  offset?: number
  filters?: Array<CompositeFilterDescriptor | FilterDescriptor>
  sort?: SortDescriptor[]
  schema?: object
  status?: string[]
}

export interface TableSearchQueryPayloadType {
  data?: Payload
}

interface SearchContextType {
  query?: QueryType
  defaultQuery?: QueryType
  setQuery?: Dispatch<SetStateAction<undefined | QueryType>>
  setDefaultQuery?: Dispatch<SetStateAction<undefined | QueryType>>
  isKeywordSearchEnabled?: boolean
  tableSearchQueryPayload?: TableSearchQueryPayloadType
  setTableSearchQueryPayload?: Dispatch<SetStateAction<TableSearchQueryPayloadType | undefined>>
}

export const SearchContext = createContext<SearchContextType>({});
