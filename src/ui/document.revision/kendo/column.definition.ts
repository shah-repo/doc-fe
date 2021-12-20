import { GridPagerSettings } from "@progress/kendo-react-grid/dist/npm/paging/GridPagerSettings";
import { KendoCellTemplates } from "../../components/common/kendo.column.templates/types";
import { DocumentListColumnsInterface } from "./types";

const columns: DocumentListColumnsInterface[] = [
  {
    field: "document.docId",
    title: "DOC ID",
    show: true,
    filter: "text",
    locked: false,
    width: "200px",
    groupable: false,
    showColumnMenu: true,
    orderIndex: 0,
  },
  {
    field: "displayRevision",
    title: "REVISION",
    show: true,
    filter: "text",
    locked: false,
    width: "200px",
    groupable: false,
    showColumnMenu: true,
    orderIndex: 1,
  },
  {
    field: "name",
    title: "DOCUMENT TITLE",
    show: true,
    filter: "text",
    locked: false,
    width: "400px",
    groupable: false,
    showColumnMenu: true,
    orderIndex: 2,
  },
  {
    field: "document.documentType.documentTypeAcronym",
    title: "TYPE",
    show: true,
    filter: "text",
    locked: false,
    width: "200px",
    groupable: true,
    showColumnMenu: true,
    orderIndex: 3,
  },
  {
    field: "owner.user.name",
    title: "OWNER",
    show: true,
    filter: "text",
    locked: false,
    width: "200px",
    groupable: true,
    cell: KendoCellTemplates.USER_AVATAR,
    showColumnMenu: true,
    orderIndex: 4,
  },
  {
    field: "changeRequest.crId",
    title: "AR ID",
    show: true,
    filter: "text",
    locked: false,
    width: "200px",
    groupable: false,
    showColumnMenu: true,
    orderIndex: 5,
  },
  {
    field: "displayStatus",
    title: "STATUS",
    show: true,
    locked: false,
    width: "200px",
    groupable: true,
    // filterCell: DisplayStatusFilterCell,
    cell: KendoCellTemplates.STATUS,
    showColumnMenu: true,
    orderIndex: 6,
  },
  {
    field: "effectiveDate",
    title: "EFFECTIVE DATE",
    show: true,
    filter: "date",
    locked: false,
    width: "150px",
    groupable: false,
    format: "{0:d}",
    // cell: KendoDateCell,
    showColumnMenu: true,
    orderIndex: 7,
  },
];

const statusToClassMapping = {
  "Released": "statusReleased",
  "Draft": "statusDraft",
  "In Review": "statusReview",
  "Pending Change": "statusPendingChange",
};
// TODO: Get List Dynamic for now added static datasource
const typeFilteDS = ["ADM", "AR", "DAM",  "DD", "DFM", "ES", "FM", "LFPO", "LHRT", "MPI", "MT", "NAD", "NCO"];
interface PageState {
  skip: number;
  take: number;
}
const pagerSettings: GridPagerSettings = {
  buttonCount: 5,
  info: true,
  type: "numeric",
  pageSizes: [25, 50, 75, 100, 500, 1000],
  previousNext: true,
};

const initialDataState: PageState = { skip: 0, take: 25 };

const gridConfiguration = {
  columns,
  pagerSettings,
  initialDataState,
  statusToClassMapping,
  typeFilteDS,
};

export default gridConfiguration;
