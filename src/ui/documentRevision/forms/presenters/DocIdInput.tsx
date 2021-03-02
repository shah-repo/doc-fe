import * as React from "react";
import { useSelector } from "react-redux";
import { DocumentTypeByIdState } from "../../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevisionDocument } from "../../../../state/ducks/documentRevisions/types";
import { documentsSelectors } from "../../../../state/ducks/documents";
import { DocumentProposedIdSetAction } from "../../../../state/ducks/documents/types";
import { AsyncStatus } from "../../../../state/types";
import InputField from "../../../components/forms/fields/Input";
import { toastError } from "../../../components/notifications";
import CustomLabelTooltip from "../../../hooks/docCustomization/CustomLabelTooltip";
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
  const loadProposedDocIdState = useSelector(documentsSelectors.getLoadProposedDocIdAsyncState);
  React.useEffect(() => {
    if (loadProposedDocIdState.status === AsyncStatus.Error) {
      toastError(loadProposedDocIdState.message);
    }
  }, [loadProposedDocIdState]);
  const { isVisible, label, tooltipConfig, validation: validators } = useDocId(documentTypeId);
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
    <CustomLabelTooltip {...{ tooltipConfig }}>
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
    </CustomLabelTooltip>
  );
};

export default DocIdInput;
