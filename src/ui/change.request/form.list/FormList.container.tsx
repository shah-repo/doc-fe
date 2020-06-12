import React, { useEffect, useState } from "react";
import { documentTypeActions } from "../../../state/ducks/documentRevisions/documentType";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import FormListPreseneter from "./FormList.presenter";

export const FromListContainer: React.FunctionComponent<{}> = () => {
  const [templateOptions, setTemplateOptions] = useState<DocumentType[]>([]);
  const getDocTypeByGroupAction = useActionCreator(documentTypeActions.getDocTypeByGroup);

  const asyncGetDocTypeByGroup = useAsync({
    onSuccess: (data: DocumentType[] = []) => {
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
  console.log(templateOptions);
  return (
    <FormListPreseneter {...{ templateOptions }}/>
  );
};

export default FromListContainer;
