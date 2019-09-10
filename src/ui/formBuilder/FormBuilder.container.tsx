import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import NavigationIcon from "@material-ui/icons/Navigation";
import Text from "../components/Text";
import { formBuilderActions } from "../../state/ducks/formBuilder";
import { formReducerType } from "../../state/ducks/formBuilder/reducer";
import styles from "./components/modal/Modal.module.css";
import FormBuilderPresenter from "./FormBuilder.presenter";
import FBDialog from "../form.builder/components/dialog/FBDialog";
import {
  FBDialogAction,
  FBDialogProps,
} from "../form.builder/components/dialog/utils/types";
import { Box, Fab } from "@material-ui/core";
import { withDialogStates } from "../form.builder/components/dialog/utils/hoc";

interface FormBuilderStateType {
  formBuilderState: formReducerType;
}

interface DispatchProps {
  setFormInfo: typeof formBuilderActions.setFormInfo;
}

const mapStateToProps = ({ formBuilderState }: formReducerType) => ({
  formBuilderState,
});

type StateProps = FormBuilderStateType & DispatchProps & FBDialogProps;

const FormBuilderContainer: React.FunctionComponent<StateProps> = ({
  formBuilderState,
  setFormInfo,
  ...props
}) => {
  const [headerState, setHeaderState] = useState({ title: "", formNumber: 0 });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setHeaderState({ ...headerState, [name]: value });
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    setFormInfo(headerState.title, headerState.formNumber, "Draft");
    props.setDialogClose!();
  };

  const createForm = (
    <FBDialog title="form.builder.create" {...props}>
      <form onSubmit={submitForm}>
        <div className={styles.modalFormContainer}>
          <Box mb={4}>
            <Box
              mb={0.5}
              fontSize="subtitle1.fontSize"
              fontWeight="fontWeightRegular"
            >
              <label>Form Title</label>
            </Box>
            <input
              type="text"
              onChange={handleInputChange}
              name="title"
              placeholder="Enter here"
              required={true}
            />
          </Box>
          <Box mb={4}>
            <Box
              mb={0.5}
              fontSize="subtitle1.fontSize"
              fontWeight="fontWeightRegular"
            >
              <label>Form Number</label>
            </Box>
            <input
              type="number"
              onChange={handleInputChange}
              name="formNumber"
              placeholder="Enter here"
              required={true}
            />
          </Box>
          <button type="submit">Create</button>
        </div>
      </form>
    </FBDialog>
  );

  return (
    <Fragment>
      <Fab variant="extended" size="small" onClick={props.setDialogOpen}>
        <NavigationIcon />
        <Text message="form.builder" />
      </Fab>
      {createForm}
    </Fragment>
  );
};

export default connect(
  mapStateToProps,
  { setFormInfo: formBuilderActions.setFormInfo },
)(withDialogStates(FormBuilderContainer));
