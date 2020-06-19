import { Grid } from "@material-ui/core";
import { useFormikContext } from "formik";
import * as React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { authSelectors } from "../../../../state/ducks/auth";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { ChangeRequest } from "../../../../state/ducks/changeRequest";
import { AsyncState } from "../../../../state/types";
import OwnerChangerContainer from "../../../components/common/owner.changer/container";
import { RequestType } from "../../../components/common/owner.changer/helpers/types";
import SubmitButton from "../../../components/forms/SubmitButton";
import { FB } from "../../../form.builder";
import useGetHasTag from "../../../hooks/useGetHasTag";
import { canChangeCROwner } from "../../utils/helpers";
import { RouteParamsCreate } from "../../utils/types";
import { formIdContext } from "./AssessmentForm.presenter";
import AssessmentFormControlsContainer from "./AssessmentFormControls.container";
import AssessmentFormVoidContainer from "./Void.container";

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
  const isCompanyAdmin = useGetHasTag(GroupTag.USER_MANAGEMENT);
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const canChangeOwnerShip = React.useMemo(() => {
    if (!changeRequest) {
      return false;
    }
    return canChangeCROwner(changeRequest.state, currentEmployeeId, changeRequest?.owner.id, isCompanyAdmin);
  }, [changeRequest, currentEmployeeId, isCompanyAdmin]);

  function setFBValue() {
    switch (workspaceState?.getMode()) {
      case "form":
        formik.setFieldValue("formDocument", { id: formDocumentId });
        formik.setFieldValue("documentType", { id: documentTypeId });
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
        label={
          changeRequest
            ? "common.save"
            : "navigation.createChangeRequest"
        }/>
      {changeRequest && canChangeOwnerShip &&
        <OwnerChangerContainer
          requestId={changeRequest.id}
          requestType={RequestType.ChangeRequest}
        />}
      <AssessmentFormVoidContainer changeRequest={changeRequest} />
      <AssessmentFormControlsContainer changeRequest={changeRequest} />
    </Grid>
  ); };

export default withRouter(DocRevActions);
