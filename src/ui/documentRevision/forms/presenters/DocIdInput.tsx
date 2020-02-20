import * as React from "react";
import InputField from "../../../components/forms/fields/Input";
import { DocumentRevisionDocument } from "../../../../state/ducks/documentRevisions";
import { DocumentProposedIdSetAction } from "../../../../state/ducks/documents";
import { DocumentTypeByIdState } from "../../../../state/ducks/documentRevisions/documentType";

interface Props {
  isDisabled: boolean;
  document?: Partial<DocumentRevisionDocument>;
  documentTypesById: DocumentTypeByIdState;
  setDocId: ((docId: string) => DocumentProposedIdSetAction) | undefined;
}

const DocIdInput: React.FunctionComponent<Props> = ({
  isDisabled,
  document = {},
  documentTypesById,
  setDocId,
}) => {
  const handleDocIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const { documentType } = document;

    if (!documentType || !documentType.id) {
      return;
    }

    const type = documentTypesById[documentType.id].documentTypeAcronym;

    if (!document && !type) {
      return;
    }
    const pattern = new RegExp("^" + type + "\\d{0," + type.length + "}", "g");

    if (!pattern.test(value) || !setDocId) {
      return;
    }
    setDocId(value);
  };

  return (
    <InputField
      name="document.docId"
      label="common.documentId"
      inputProps={{
        id: "document.docId",
        value: document.docId,
        disabled: isDisabled,
        onChange: handleDocIdChange,
      }}
    />
  );
};

export default DocIdInput;
