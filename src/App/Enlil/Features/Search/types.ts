import { SortDescriptor } from '@progress/kendo-data-query';

export interface Option {
  group?: string
  label?: string
  query?: string
  document?: Document
}

export interface Facet {
  id: string
  label: string
  count: number
  children?: Facet[]
}

export interface Document {
  id: string
  docId: string
  documentTypeCategory: string
  companyId: string
  companyName: string
  revisionId: string
  revisionName: string
  displayRevision: string
  status: string
  userId: string
  userName: string
}

export interface SearchRequestBody {
  searchText: string
  facets?: string[]
  limit?: number
  offset?: number
  sort?: SortDescriptor[]
}

export interface SearchRequestResponse {
  documents: Document[]
  facets: Facet[]
  limit: number
  total: number
}
