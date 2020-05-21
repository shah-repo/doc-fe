import { FieldValidator } from "formik";
import * as React from "react";
import { useSelector } from "react-redux";
import { documentTypeSelectors } from "../../../../state/ducks/documentRevisions/documentType";
import RichTextEditor from "../../../components/forms/fields/RichTextEditor";
import useDescription from "../../../hooks/docCustomization/useDescription";

interface Props {
  isQms: boolean;
  documentTypeId?: string;
  isDisabled?: boolean;
}

const Description: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  isQms,
  isDisabled = false,
}) => {
  const [isVisible, placeholder, validators] = useDescription(documentTypeId, isQms);
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];

  if (!isVisible) {
    return null;
  }

  return (
    <RichTextEditor
      name="description"
      label={`common.description.${documentType?.documentTypeAcronym}`}
      validate={validators as FieldValidator}
      editorProps={{ placeholder: (placeholder as string), readOnly: isDisabled }}
    />
  );
};

export default React.memo(Description);
