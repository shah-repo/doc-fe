import { Box, Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import React, { useState } from "react";
import Text from "../components/Text";
import FBDialog from "./components/dialog/FBDialog";
import { withDialogStates } from "./components/dialog/utils/hoc";
import { FBDialogAction, FBDialogProps } from "./components/dialog/utils/types";
import FBTextField from "./components/inputs/textfield/FBTextField";
import FormBuilderContainer from "../formBuilder/FormBuilder.container";
import { HeaderState } from "../../state/ducks/formBuilder/types";
import { connect } from "react-redux";
import { formBuilderActions } from "../../state/ducks/formBuilder";

interface DispatchProps {
  setFormInfo: typeof formBuilderActions.setFormInfo;
}

type formProps = FBDialogProps & DispatchProps;

const FormBuilder: React.FunctionComponent<formProps> = ({
  setFormInfo,
  ...props
}) => {
  const onActionClick = (action: FBDialogAction) => createForm();

  const createForm = () => {
    setFormInfo(headerState.title, headerState.formNumber, "Draft");
    props.setDialogClose();
  };

  const [headerState, setHeaderState] = useState<HeaderState>({
    title: "",
    formNumber: 0,
  });

  const handleChange = (title: string, formNumber: number) => {
    setHeaderState({ title, formNumber });
  };

  return (
    <Box mb={1} display="flex" flexDirection="row-reverse">
      <Fab variant="extended" size="small" onClick={props.setDialogOpen}>
        <NavigationIcon />
        <Text message="form.builder" />
      </Fab>
      <FBDialog
        title="form.builder.create"
        actions={["create"]}
        onActionClick={onActionClick}
        {...props}
      >
        <FormBuilderContainer handleChange={handleChange} />
      </FBDialog>
    </Box>
  );
};

export default connect(
  null,
  { setFormInfo: formBuilderActions.setFormInfo },
)(withDialogStates(FormBuilder));
