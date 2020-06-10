import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { getTableCriteria, getTableData } from "../../../common/utils/selectors";
import { documentRevisionsActions } from "../../../state/ducks/documentRevisions";
import { documentTypeActions, DocumentTypeById, documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import tableSearchActions from "../../../state/ducks/tableSearch/actions";
import { HOME_URL } from "../../constants/urls";
import { documentRevisionQueryStatus } from "../../document.revision/utils/helpers";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import FormListDialog from "../FormListDialog/FormListDialog.presenter";
import { RouteParams } from "../utils/types";
import DocumentByTypeListPresenter from "./presenter";

type Props = RouteComponentProps<RouteParams>;

export const DocumentByTypeListContainer: React.FunctionComponent<Props> = ({
  match, history,
}) => {
  const dialog = useDialog();
  const { docTypeId } = match.params;
  const [noForm, toggleNoForm] = React.useState(false);
  const [multipleForm, toggleMultipleForm] = React.useState(false);
  const [selectedFormId, saveSelectedFormId] = React.useState("");
  const [docId, setDocId] = React.useState("");
  const documentType = useSelector(documentTypeSelectors.byId)?.[docTypeId];
  const TABLE_NAME = `documentsByTypeList-${documentType?.documentTypeAcronym}`;
  const dispatch = useDispatch();
  const docRevId = useSelector(documentTypeSelectors.docRevTypeById);
  const tableCriteria = useSelector(getTableCriteria(TABLE_NAME));
  const tableData = useSelector(getTableData(TABLE_NAME));
  const getDocRevByIds = useActionCreator(documentTypeActions.getDocTypeIds);
  const formIds = useSelector(documentTypeSelectors.formIds);

  useEffect(() => {
    if (isEmpty(tableCriteria.queryDict)) {
      dispatch(
        tableSearchActions.setSearchCriteria(
          {
            ...tableCriteria,
            queryDict: {
              "status[]": documentRevisionQueryStatus(),
            },
          },
          TABLE_NAME,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docTypeId]);

  useEffect(() => {
    dispatch(documentRevisionsActions.loadList());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const async = useAsync<DocumentTypeById>({
    onSuccess: () => {
      if (formIds.length === 1) {
        history.push(`/document_revision/${formIds[0].document.id}/output_document/${docRevId}`);
        return;
      } else if (isEmpty(formIds)) {
        toggleNoForm(true);
        setTimeout(() => toggleNoForm(false), 1000);
        return;
      }
      toggleMultipleForm(true);
      dialog.open();
    },
  });

  const clearFilter = () =>
    dispatch(tableSearchActions.clearSearchCriteria(TABLE_NAME));

  if (!documentType || !documentType.pageDetails) {
    return <Redirect to={HOME_URL} />;
  }

  const openDocRev = () => {
    async.start(getDocRevByIds, documentType.id, async);
  };

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();

  const handleSelection = (event) => {
    const form = formIds.find((form) => form.id === event.target.value);
    form && setDocId(form.document.id);
    saveSelectedFormId(event.target.value);
  };

  const redirectToForm = () => {
    history.push(`/document_revision/${docId}/output_document/${selectedFormId}`);
  };

  return (
    <div style={{ height: "100%" }}>
      {multipleForm && <FormListDialog
        dialog={dialog}
        preventPropagation={preventPropagation}
        selectedFormId={selectedFormId}
        handleSelection={handleSelection}
        formIds={formIds}
        redirectToForm={redirectToForm}
      />}
      <DocumentByTypeListPresenter
        tableName={TABLE_NAME}
        tableCriteria={tableCriteria}
        tableData={tableData}
        clearFilter={clearFilter}
        documentType={documentType}
        openDocRev={openDocRev}
        showError={noForm}
      />
    </div>
  );
};

export default DocumentByTypeListContainer;
