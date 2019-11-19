import { Field } from "formik";
import React from "react";
import { connect } from "react-redux";
import {
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import { TextFieldSelect } from "../../components/forms/fields/TextFieldSelect/container";
import { required, validator } from "../../components/forms/fields/validators";

interface StateProps {
  documents: DocumentRevision[];
  loadAsyncState: AsyncState;
}

interface DispatchProps {
  loadDocumentRevisions: typeof documentRevisionsActions.loadList;
}

export type Props = StateProps & DispatchProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  documents: documentRevisionsSelectors.getDocumentRevisionsList(state),
  loadAsyncState: documentRevisionsSelectors.getLoadListAsyncState(state),
});

export const Title: React.FunctionComponent<Props> = ({
  documents,
  loadAsyncState,
  loadDocumentRevisions,
}) => {
  const loadAction = () => loadDocumentRevisions();
  const options = documents.map((document) => ({
    label: document.description,
    value: document.description,
    isDisabled: true,
  }));

  return (
    <AsyncGate
      asyncState={loadAsyncState}
      asyncAction={loadAction}
      startActionOnMount={true}
    >
      <Field
        name="title"
        label="cr.title"
        options={options}
        component={TextFieldSelect}
        validate={validator(required)}
      />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, {}, ApplicationState>(
  mapStateToProps,
  {
    loadDocumentRevisions: documentRevisionsActions.loadList,
  },
)(Title);
