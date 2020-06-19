import * as React from "react";
import { DocumentRevisionDocument } from "../../../../state/ducks/documentRevisions";
import { DocumentTypeByIdState } from "../../../../state/ducks/documentRevisions/documentType";
import { DocumentProposedIdSetAction } from "../../../../state/ducks/documents";
import InputField from "../../../components/forms/fields/Input";
import { useDocId } from "../../../hooks/docCustomization/useCustomization";
import { DocumentCloneType } from "../../Clone.container";

interface Props {
  isDisabled: boolean;
  document?: Partial<DocumentRevisionDocument>;
  documentTypesById: DocumentTypeByIdState;
  documentTypeId?: string;
  setDocId: ((docId: string) => DocumentProposedIdSetAction) | undefined;
  type?: DocumentCloneType;
}

const DocIdInput: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  isDisabled,
  document = {},
  documentTypesById,
  setDocId,
  type,
}) => {
  const [isVisible, label, validators] = useDocId(documentTypeId);
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

  if (!isVisible && type !== "newOutput") {
    return null;
  }

  return (
    <InputField
      name="document.docId"
      label={label}
      inputProps={{
        id: "document.docId",
        value: document.docId,
        disabled: isDisabled,
        onChange: handleDocIdChange,
      }}
      validate={validators}
    />
  );
};

export default DocIdInput;
