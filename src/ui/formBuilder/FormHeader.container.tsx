import React from "react";
import { connect } from "react-redux";
import { formReducerType } from "../../state/ducks/formBuilder/reducer";
import FormHeaderPresenter from "./FormHeader.presenter";

interface StateProps {
  formNumber: string;
  status: string;
  title: string;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  formNumber: formBuilderState.formNumber,
  status: formBuilderState.status,
  title: formBuilderState.title,
});

const FormHeaderContainer: React.FunctionComponent<StateProps> = ({
  formNumber,
  status,
  title,
}) => (
  <FormHeaderPresenter
    formNumber={formNumber}
    status={status}
    title={title}
  />
);

export default connect(mapStateToProps)(FormHeaderContainer);
