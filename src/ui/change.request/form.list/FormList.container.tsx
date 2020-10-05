import { flatten } from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { documentTypeActions, DocumentTypeById } from "../../../state/ducks/documentRevisions/documentType";
import { HeaderTableType } from "../../../state/ducks/documentRevisions/types";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDialog from "../../hooks/useDialog";
import { TemplateOption } from "../form/types";
import FormListPresenter from "./FormList.presenter";

interface Props {
  headers: HeaderTableType[];
  data: any[];
}

export const FromListContainer: React.FunctionComponent<Props> = ({ headers, data }) => {
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const getDocTypeByGroupAction = useActionCreator(documentTypeActions.getDocTypeByGroup);
  const history = useHistory();

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
  const handleCreateButton = () => {
    if (templateOptions.length === 1) {
      history.push(`/change_request/${templateOptions[0].value}/create/${templateOptions[0].docTypeId}`);
    }
    dialog.open();
  };

  return (
    <FormListPresenter {...{ templateOptions, dialog, handleCreateButton, headers, data, exportDialog }}/>
  );
};

export default FromListContainer;
