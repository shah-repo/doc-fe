import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ChangeRequest } from "../../../../state/ducks/changeRequest/types";
import { AsyncState } from "../../../../state/types";
import SubmitButton from "../../../components/forms/SubmitButton";
import { FB } from "../../../form.builder";
import { RouteParamsCreate } from "../../utils/types";
import { formIdContext } from "./AssessmentForm.presenter";
import AssessmentFormControlsContainer from "./AssessmentFormControls.container";

interface OwnProps {
  changeRequest?: ChangeRequest;
  asyncState: AsyncState;
}
type Props = OwnProps & RouteComponentProps<RouteParamsCreate>;

const DocRevActions: React.FunctionComponent<Props> = ({
  changeRequest,
  asyncState,
  match,
}) => {
  const formDocumentId = React.useContext(formIdContext) || match.params.formId;
  const documentTypeId = match.params.documentTypeId;
  const { workspaceState, formState } = FB.useStores();
  const formik = useFormikContext();


  function setFBValue() {
    switch (workspaceState?.getMode()) {
      case "form":
        // formDocument and documentType fields should be set only once
        // and that is when we create CR, not on every save
        // because it sets dirty flag to true and prompts alert for unsaved changes
        !changeRequest && formik.setFieldValue("formDocument", { id: formDocumentId });
        !changeRequest && formik.setFieldValue("documentType", { id: documentTypeId });
        formik.setFieldValue("formInput", formState?.getValues());
        break;
      default:
        formik.setFieldValue("formTemplate", undefined);
    }
  }
  const onFormClick = () => {
    setFBValue();
    formik.submitForm();
  };

  const label = changeRequest ? "common.save" : "navigation.createChangeRequest";

  return (
    <Grid
      container={true}
      alignItems="flex-end"
      justify="flex-end"
      direction="row"
    >
      <SubmitButton
        id="submit"
        asyncState={asyncState}
        onClick={onFormClick}
        dataCy={label}
        label={label} />
      <AssessmentFormControlsContainer changeRequest={changeRequest} />
    </Grid>
  );
};

export default withRouter(DocRevActions);
