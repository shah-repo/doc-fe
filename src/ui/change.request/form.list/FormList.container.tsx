import { flatten, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentTypeById } from "../../../state/ducks/documentRevisions/documentType/types";
import { HeaderTableType } from "../../../state/ducks/documentRevisions/types";
import { toastError } from "../../components/notifications";
import { TableDataProps } from "../../components/table/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import { templateOptionToChangeRequestCreateBody } from "../form/transform";
import { TemplateOption } from "../form/types";
import { changeRequestEditPath } from "../utils/paths";
import FormListPresenter from "./FormList.presenter";

interface Props {
  headers: HeaderTableType[];
  tableData: TableDataProps<ChangeRequest>;
}

const FormListContainer: React.FunctionComponent<Props> = ({ headers, tableData }) => {
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const getDocTypeByGroupAction = useActionCreator(documentTypeActions.getDocTypeByGroup);
  const history = useHistory();

  const createCRAction = useActionCreator(changeRequestsActions.create);
  const createCRAsync = useAsync<ChangeRequest>({
    onSuccess: (createdChangeRequest?) => {
      createdChangeRequest && history.push(changeRequestEditPath(createdChangeRequest.id));
    },
    onError: (err) => {
      toastError(err as string);
    },
  });

  const asyncGetDocTypeByGroup = useAsync({
    onSuccess: (data: DocumentTypeById[] = []) => {
      const options = flatten(
        data.map((template) =>
          template.forms.map((form) => (
            {
              label: form.name,
              value: form.id,
              docTypeId: template.documentType.id,
            }
          ))));
      setTemplateOptions(options);
    },
  });

  useEffect(() => {
    asyncGetDocTypeByGroup.start(
      getDocTypeByGroupAction,
      { docTypeGroupOption: "CHANGE_REQUEST" },
      asyncGetDocTypeByGroup);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dialog = useDialog();
  const exportDialog = useDialog();

  const renderTableData = () => {
    if (!isEmpty(tableData)) {
      return tableData.map((e) => ({
        crId: e.crId,
        title: e.title,
        owner: e.owner.user.name,
        state: e.state,
      }));
    }
    const defaultEmptyColumn = headers.map((column) => ({ [column.key]: "" }));
    return [Object.assign({}, ...defaultEmptyColumn)];
  };

  const data = exportDialog.isOpen ? renderTableData() : [];

  const handleCreateButton = () => {
    if (templateOptions.length === 1) {
      processCreatingRevision(templateOptions[0]);
    } else {
      dialog.open();
    }
  };

  const processCreatingRevision = (templateChosen) => {
    const data = templateOptionToChangeRequestCreateBody(templateChosen);
    createCRAsync.start(createCRAction, data, createCRAsync);
  };

  return (
    <FormListPresenter {...{
      templateOptions, dialog, handleCreateButton, headers, data, exportDialog,
      handleTemplateSelection: processCreatingRevision,
    }}/>
  );
};

export default FormListContainer;
