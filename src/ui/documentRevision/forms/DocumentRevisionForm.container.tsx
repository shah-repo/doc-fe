import { Formik, FormikActions, FormikProps } from "formik";
import _ from "lodash";
import React from "react";
import { DocumentRevision, documentRevisionsSelectors } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import DocumentRevisionFormPresenter from "./DocumentRevisionForm.presenter";
import { DocumentRevisionFormValues } from "./types";
import { ApplicationState } from "../../../state/reducers";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { connect } from "react-redux";

interface StateProps {
  availableReferences: OptionType[];
}
interface OwnProps {
  initialValues: DocumentRevisionFormValues;
  asyncState: AsyncState;
  documentRevisions?: DocumentRevision[];
  onSubmit: (values: DocumentRevisionFormValues, actions: FormikActions<DocumentRevisionFormValues>) => void;
}

type DocumentRevisionFormContainerProps = OwnProps & StateProps;

const mapStateToProps = (state: ApplicationState): StateProps => ({
  availableReferences: documentRevisionsSelectors.getAvailableReferences(state),
});

export const DocumentRevisionFormContainer: React.FunctionComponent<DocumentRevisionFormContainerProps> = ({
  onSubmit,
  initialValues,
  asyncState,
  documentRevisions,
  availableReferences,
}) => {
    const render = (props: FormikProps<DocumentRevisionFormValues>) => (
      <DocumentRevisionFormPresenter
        {...props}
        asyncState={asyncState}
        documentRevisions={documentRevisions}
        availableReferences={availableReferences}
      />
    );

    return (
      <Formik
        render={render}
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
      />
    );
  };

export default connect<StateProps, {}, OwnProps, ApplicationState>(mapStateToProps, {})(DocumentRevisionFormContainer);
