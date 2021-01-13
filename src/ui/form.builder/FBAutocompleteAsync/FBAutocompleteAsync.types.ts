import { AutocompleteProps } from "@material-ui/lab/Autocomplete";
import { FBAutocompleteAsyncState, FBAutocompleteProps } from "..";

export type FBAutocompleteAsyncProps =
& FBAutocompleteProps
& Pick<Partial<AutocompleteProps>, "renderInput" | "loading" | "defaultValue" | "renderTags">
& {
  autocompleteAsyncState?: FBAutocompleteAsyncState;
  selectedOptions?: string[];
  shouldReloadOnInit?: boolean;
  additionalData?: any[]; // TODO: make autocomplete async generic type by data
  forceNewRender?: boolean;
};

export interface FBAutocompleteAsyncConfig  {
  id: string;
  path: string;
  label: string;
  labelKey: string;
  valueKey?: string;
  root?: string;
  labelPrefixRoot?: string;
  includeRevision?: string;
}

export enum FBAutocompleteAsyncOption {
  activeDocumentRevisions = "1",
  changeRequests = "2",
  availableApprovers = "3",
  documentTypes = "4",
  suppliers = "5",
  TLList = "6",
  CSLList = "7",
  companyAddresses = "8",
  GLCodes = "9",
  groups = "10",
  parts = "11",
  POList = "12",
  employees = "13",
  officialGroups = "14",
  WOParts = "15",
  DRAFTdocumentRevisions = "16",
  approvalRoles = "17",
  documentRevisions = "18",
  materials = "19",
  equipment = "20",
  availableParts = "21",
  partDocumentTypes = "22",
  preventativeMaintenaceForms = "23",
  lots = "24",
  availablePartDocuments = "25",
  ebParts = "26",
  ebLots = "27",
}
