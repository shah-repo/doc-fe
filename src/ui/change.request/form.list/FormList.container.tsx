import React, { useEffect, useState } from "react";
import { documentTypeActions, DocumentTypeById } from "../../../state/ducks/documentRevisions/documentType";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import FormListPreseneter from "./FormList.presenter";

export const FromListContainer: React.FunctionComponent<{}> = () => {
  const [templateOptions, setTemplateOptions] = useState<DocumentTypeById[]>([]);
  const getDocTypeByGroupAction = useActionCreator(documentTypeActions.getDocTypeByGroup);

  const asyncGetDocTypeByGroup = useAsync({
    onSuccess: (data: DocumentTypeById[] = []) => {
      setTemplateOptions(data);
    },
  });

  useEffect(() => {
    asyncGetDocTypeByGroup.start(
      getDocTypeByGroupAction,
      { docTypeGroupOption: "CHANGE_REQUEST" },
      asyncGetDocTypeByGroup);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormListPreseneter {...{ templateOptions }}/>
  );
};

export default FromListContainer;
