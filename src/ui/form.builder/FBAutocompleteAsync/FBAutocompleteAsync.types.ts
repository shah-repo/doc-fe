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
  /**
   * @cfg {Record} Additional url params.
   */
  urlValues?: Record<string, any>;
  withoutPrefixRoot?: boolean;
  withoutLabelKey?: boolean;
};

export interface FBAutocompleteAsyncConfig  {
  id: string;
  label: string;
  labelKey: string;
  valueKey?: string;
  root?: string;
  labelPrefixRoot?: string;
  includeRevision?: string;
  publicApi?: boolean;
  /**
   * @cfg {Bool} If true show the option in editor config.
   */
  hidden?: boolean;
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
  supplierDocumentTypes = "26",
  ebLots = "27",
  seed = "28",
  mpiDocuments = "29",
  unitMeasures = "30",
  docRevByDoc = "31",
  docParts = "32",
  releasedEquipment = "33",
  releasedFormDocuments = "34",
  outputDocumentTypes = "35",
}

export interface FBAutocompleteAsyncConstructor {
  optionId?: string;
  urlValues?: Record<string, any>;
}
