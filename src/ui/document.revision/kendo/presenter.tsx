import { Box, Button, Grid, Typography } from "@material-ui/core";
import { isEmpty, map, set } from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as ExportIcon } from "../../../assets/images/export_data.svg";
import { docRevSch } from "../../../common/normalizrSchema";
import {
  getFormattedDateString,
  MomentFormats,
} from "../../../common/utils/date";
import { stripTags } from "../../../common/utils/helpers";
import { DOCUMENT_REVISION_ROOT_URL } from "../../../state/ducks/documentRevisions/constants";
import { DOC_TYPE_GROUP_OPTION } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { removeLastCharacterIfNotAlphaNumeric } from "../../common/utils/helpers";
import { DocumentTypeOptions, KendoGridCriteria } from "../../components/common/kendo.column.templates/types";
import Text from "../../components/Text";
import { DOCUMENT_REVISION_CREATE_URL } from "../../constants/urls";
import { checkIfDocumentHasOptions } from "../../documentRevision/helpers/checkDocumentGroup";
import useDialog from "../../hooks/useDialog";
import ExportListDialog from "../list/ExportListDialog/ExportListDialog";
import gridConfiguration from "./column.definition";
import { KendoPanel } from "./KendoPanel";
import KendoGridStyles from "./styles";

interface KendoGridProps {
  data: DocumentRevision[];
  tableName: string;
  tableCriteria: KendoGridCriteria;
  statuses: string[];
  documentTypeOptions: DocumentTypeOptions[];
  editDocumentRevision: (documentRevisionId: string, documentId: string) => void;
  previewDocumentRevision: (documentRevisionId: string, documentId: string) => void;
}

export const KendoGridList: React.FunctionComponent<KendoGridProps> = ({
  documentTypeOptions,
  tableName,
  tableCriteria,
  data,
  statuses,
  editDocumentRevision,
  previewDocumentRevision,
}) => {
  const classes = KendoGridStyles();

  const dialog = useDialog();

  const headers = map(gridConfiguration.columns, (column) => ({
    label: column.title,
    key: column.field,
  }));

  const renderTableData = () => {
    if (!isEmpty(data)) {
      return data.map((e) => ({
        docId: e.document.docId,
        displayRevision: e.displayRevision,
        documentTitle: e.name,
        type: e.document.documentType.documentTypeAcronym,
        owner: e.owner.user.name,
        crId: e.changeRequest?.crId || "",
        status: e.displayStatus.toUpperCase(),
        effectiveDate: e.effectiveDate
          ? getFormattedDateString(e.effectiveDate, MomentFormats.MonthDateYear)
          : "",
      }));
    }
    const defaultEmptyColumn = headers.map((column) => ({ [column.key]: "" }));
    return [Object.assign({}, ...defaultEmptyColumn)];
  };
  const exportData = dialog.isOpen ? renderTableData() : [];

  const customDataSet = (data: DocumentRevision[]) => {
    const customData = data.reduce<DocumentRevision[]>((acc, docRev) => {
      if (
        !checkIfDocumentHasOptions(
          [
            DOC_TYPE_GROUP_OPTION.RECORD,
            DOC_TYPE_GROUP_OPTION.EQUIPMENT,
            DOC_TYPE_GROUP_OPTION.ENGINEERING_BUILD,
            DOC_TYPE_GROUP_OPTION.PART,
            DOC_TYPE_GROUP_OPTION.SUPPLIER,
            DOC_TYPE_GROUP_OPTION.PO,
            DOC_TYPE_GROUP_OPTION.RECEIVABLE,
          ],
          docRev.document.documentType.groupOptions
        )
      ) {
        set(docRev, "description", stripTags(docRev.description));
        set(
          docRev,
          "document.documentType.documentTypeAcronym",
          removeLastCharacterIfNotAlphaNumeric(
            docRev.document?.documentType?.documentTypeAcronym
          )
        );
        acc.push(docRev);
      }
      return acc;
    }, []);
    return customData;
  };

  return (
    <Grid container={true} className={classes.root}>
      <Grid item xs ><Typography className={classes.title}>Document List</Typography></Grid>
      <Grid item={true} style={{ textAlign: "right", marginBottom: 10 }}>
        <Button
          variant="outlined"
          className={classes.exportListbutton}
          id="ListPresenter-export-list"
          data-cy="document.revision.export.list"
          onClick={dialog.open}
        >
          <Box display="flex">
            <ExportIcon className={classes.iconSvg} height={14} width={14} />
          </Box>
          <Text translation="document.revision.export.list" />
        </Button>
        <ExportListDialog
          data={exportData}
          {...{ dialog, headers  }}
          customFileName="DocumentList"
        />
        <Link to={DOCUMENT_REVISION_CREATE_URL}>
          <Button
            className={classes.createDocButton}
            id="ListPresenter-create"
            data-cy="document.revision.create"
          >
            <Text translation="document.revision.create" />
          </Button>
        </Link>
      </Grid>
      <Grid item={true} xs={12}>
        <KendoPanel<DocumentRevision>
          tableCriteria={tableCriteria}
          gridConfiguration={gridConfiguration}
          queryUrl={DOCUMENT_REVISION_ROOT_URL}
          data={data}
          customDataSet={customDataSet}
          tableName={tableName}
          normalizrSchema={[docRevSch]}
          statuses={statuses}
          editDocumentRevision={editDocumentRevision}
          previewDocumentRevision={previewDocumentRevision}
          documentTypeOptions={documentTypeOptions}
        />
      </Grid>
      {/* TODO: Test all grid functionalities */}
    </Grid>
  );
};

export default KendoGridList;
