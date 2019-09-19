import React from "react";
import { connect } from "react-redux";
import { formReducerType } from "../../../state/ducks/formBuilder/reducer";
import FormBuilderPresenter from "../../formBuilder/FormBuilder.presenter";
import { formBuilderSubmit } from "../../formBuilder/helpers/FBLocalStorageHelper";

interface FormBuilderStateType {
  formBuilderState: formReducerType;
}

interface FBDocumentRevProps {
  documentId?: string;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  formBuilderState,
});

const FBDocumentRevision: React.FunctionComponent<FormBuilderStateType & FBDocumentRevProps> = ({
  formBuilderState,
  documentId,
}) => {

  if (documentId) {
    formBuilderSubmit(documentId, formBuilderState);
  }

  return <FormBuilderPresenter {...formBuilderState} inDialog={false} />;
};

export default connect(
  mapStateToProps,
)(FBDocumentRevision);
