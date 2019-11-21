import { Field } from "formik";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import {
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import { TextFieldSelect } from "../../components/forms/fields/TextFieldSelect/container";
import { required, validator } from "../../components/forms/fields/validators";

interface StateProps {
  documents: DocumentRevision[];
}

interface DispatchProps {
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
}

interface OwnProps {
  name: string;
  label: string;
}

export type Props = StateProps & DispatchProps & OwnProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  documents: documentRevisionsSelectors.getDocumentRevisionsList(state),
});

export const Title: React.FunctionComponent<Props> = ({
  documents,
  loadDocumentRevisions,
  ...props
}) => {
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

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadDocumentRevisions: documentRevisionsActions.loadList,
  },
)(Title);
