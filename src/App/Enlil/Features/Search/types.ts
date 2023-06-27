interface RecentSearch {
  query: string
  group: string
}

interface AllResultsOption {
  query: string
  label: string
}

export type OptionType = IStoreMappedDocument | RecentSearch | AllResultsOption | string;
export type GroupedOption = OptionType & {
  group: string
};

interface FacetFilter {
  field: string
  operator: string
  value: string
}

export interface FacetPayload {
  filters?: FacetFilter[]
  [key: string]: unknown
}

export interface FacetOption {
  id: string
  label: string
  group: string
  count?: number
  total?: number
  payload?: FacetPayload
  items?: FacetOption[]
}

export interface IStoreMappedDocument {
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

export interface IStoreResult {
  page_total: number
  documents: IStoreMappedDocument[]
  total: number
}
