export interface Option {
  group?: string
  label?: string
  query?: string
  document?: IStoreMappedDocument
}

export interface Facet {
  id: string
  label: string
  count: number
  children?: Facet[]
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
  documents: IStoreMappedDocument[]
  facets: Facet[]
  limit: number
  total: number
}
