import { Field } from "formik";
import { uniqBy } from "lodash";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { documentTypeSelectors, DynamicUIDocTypes } from "../../../state/ducks/documentRevisions/documentType";
import { TextFieldSelect } from "../../components/forms/fields/TextFieldSelect/container";
import { required, validator } from "../../components/forms/fields/validators";

interface OwnProps {
  name: string;
  label: string;
  documentTypeId?: string;
  disabled?: boolean;
}

export type Props = OwnProps;

export const Title: React.FunctionComponent<Props> = ({
  documentTypeId = "",
  label,
  ...props
}) => {
  const documentType = useSelector(documentTypeSelectors.byId)[documentTypeId];
  const [isVisible, validators] = useMemo(() => {
    switch (documentType?.documentTypeAcronym) {
      case DynamicUIDocTypes.WO:
      case DynamicUIDocTypes.RC:
      case DynamicUIDocTypes.PO:
        return [false];
      default:
        return [true, validator(required)];
    }
  }, [documentType]);
  const documents = useSelector(documentRevisionsSelectors.getDocumentRevisionsList);
  const options = useMemo(
    () =>
      uniqBy(documents, (document) => document.name)
        .map((document) => ({
          label: document.name,
          value: document.name,
          isDisabled: true,
        })),
    [documents],
  );
  label = `${label}.${documentType?.documentTypeAcronym}`;

  if (!isVisible) {
    return null;
  }

  return (
    <Field
      {...props}
      label={label}
      options={options}
      component={TextFieldSelect}
      validate={validators}
      id="Title-field"
    />
  );
};

export default React.memo(Title);
