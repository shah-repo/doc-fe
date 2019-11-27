import { Field } from "formik";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  documentRevisionsSelectors,
} from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import { TextFieldSelect } from "../../components/forms/fields/TextFieldSelect/container";
import { required, validator } from "../../components/forms/fields/validators";

interface OwnProps {
  name: string;
  label: string;
}

export type Props = OwnProps;

export const Title: React.FunctionComponent<Props> = ({
  ...props
}) => {
  const documents = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getDocumentRevisionsList(state),
  );
  const options = useMemo(
    () =>
      documents.map((document) => ({
        label: document.name,
        value: document.name,
        isDisabled: true,
      })),
    [documents],
  );

  return (
    <Field
      {...props}
      options={options}
      component={TextFieldSelect}
      validate={validator(required)}
    />
  );
};

export default Title
