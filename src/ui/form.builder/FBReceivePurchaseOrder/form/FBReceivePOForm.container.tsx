import { Box } from "@material-ui/core";
import React from "react";
import FormMessage from "../../../components/forms/FormMessage";
import FormProgress from "../../../components/forms/FormProgress";
import useAsync from "../../../hooks/useAsync";
import FBReceivePOFormPresenter from "./FBReceivePOForm.presenter";

const FBReceivePOFormContainer: React.FunctionComponent<any> = ({
  onSubmit,
  name,
  ...props
}) => {
  // const releaseAction = useActionCreator(documentRevisionsActions.createAndRelease);
  const releaseAsync = useAsync({
    onSuccess: (docRev) => {
      props.closeDialog();
    },
  });
  const handleSubmit = (values) => {
    console.log(values);
  };
  const validateForm = (values) => {
    const item = values[`${name}-formValues`] || {};
    const required = "form.builder.required";
    const errors: any = {};

    !item.received && (errors.received = required);

    return errors;
  };
  return (
    <>
      <Box marginBottom="10px">
        <FormProgress asyncState={releaseAsync.asyncState} />
        <FormMessage asyncState={releaseAsync.asyncState} />
      </Box>
      <FBReceivePOFormPresenter
        {...props}
        onSubmit={handleSubmit}
        validateForm={validateForm}
        name={name}
      />
    </>
  );
};

export default FBReceivePOFormContainer;
