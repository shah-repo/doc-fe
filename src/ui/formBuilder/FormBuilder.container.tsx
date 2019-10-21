import { Box, Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import React, { useState } from "react";
import { connect } from "react-redux";
import { formBuilderActions } from "../../state/ducks/formBuilder";
import { formReducerType } from "../../state/ducks/formBuilder/reducer";
import Text from "../components/Text";
import FBDialog from "../form.builder/components/feedback/FBDialog";
import { withDialogState } from "../form.builder/hocs/withDialogState";
import { FBDialogProps } from "../form.builder/types/dialog";
import styles from "./components/modal/Modal.module.css";
import FormBuilderPresenter from "./FormBuilder.presenter";

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
  const [formState] = useState(formBuilderState);
  const [headerState, setHeaderState] = useState({ title: "", formNumber: 0 });
  const [withHeader, setwithHeader] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setHeaderState({ ...headerState, [name]: value });
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormInfo(headerState.title, headerState.formNumber, "Draft");
    setwithHeader(true);
  };

  const createForm = (
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
  );

  return (
    <Box mb={1} display="flex" flexDirection="row-reverse">
      <Fab variant="extended" size="small" onClick={props.setDialogOpen}>
        <NavigationIcon />
        <Text message="form.builder" />
      </Fab>
      <FBDialog
        title={!withHeader && "form.builder.create"}
        fullScreen={withHeader}
        {...props}
      >
        {withHeader && <FormBuilderPresenter {...formState} />}
        {!withHeader && createForm}
      </FBDialog>
    </Box>
  );
};

export default connect(
  mapStateToProps,
  { setFormInfo: formBuilderActions.setFormInfo },
)(withDialogState(FormBuilderContainer));
