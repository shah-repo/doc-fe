import { Formik, FormikProps } from "formik";
import { isEmpty } from "lodash";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { SMFormHOCProps } from "../../../App";
import { withSMForm } from "../../../App/Shifamed/Components/SMForm/SMForm.hoc";
import { authSelectors } from "../../../state/ducks/auth";
import { GroupTag } from "../../../state/ducks/auth/types";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { ChangeRequest, ChangeRequestEditRequestBody } from "../../../state/ducks/changeRequest/types";
import { companySelectors } from "../../../state/ducks/company";
import styles from "../../common/style/styles";
import { FormContext } from "../../components/forms/FormContext";
import { compareValuesToSubmit } from "../../components/forms/helpers";
import { FB, FBBookmarkState, FBProvider, FBWorkspaceModeOptions } from "../../form.builder";
import { FBFormStateContext } from "../../form.builder/FBForm/FBForm.wrap";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useGetHasTag from "../../hooks/useGetHasTag";
import { toChangeRequestEditRequestBody, toChangeRequestFormValues } from "../form/transform";
import { ChangeRequestFormValues } from "../form/types";
import { canChangeCROwner, canEditApprovers, canEditChangeRequest, statesWithLastSavedEnabled } from "../utils/helpers";
import { changeRequestEditPath } from "../utils/paths";
import ChangeSummaryForm from "./ChangeSummaryForm";

interface OwnProps {
  changeRequest: ChangeRequest;
  currentUserEmail: string;
  hideSideBar?: boolean;
}
type Props = OwnProps & SMFormHOCProps;

const Container: React.FunctionComponent<Props> = ({
  changeRequest,
  currentUserEmail,
  hideSideBar = false,
  _formState,
}) => {
  const bookmarkState = FB.useRef<FBBookmarkState>(FBBookmarkState);

  const changeOpenStatus = (isDrawerOpen) => {
    setOpen(isDrawerOpen);
  };

  const [isDrawerOpen, setOpen] = React.useState(true);
  const classes = styles({ isDrawerOpen });
  useDocumentTitle(changeRequest.crId);

  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const autosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);
  const isCompanyAdmin = useGetHasTag(GroupTag.USER_MANAGEMENT);
  const hasOwnershipTag = useGetHasTag(GroupTag.OWNERSHIP_CHANGE);

  const displayLastSaved = statesWithLastSavedEnabled.includes(changeRequest.state);

  const canChangeOwnership = canChangeCROwner(
    changeRequest.state,
    currentEmployeeId,
    changeRequest.owner.id,
    isCompanyAdmin,
    hasOwnershipTag);
  const canEdit = canEditApprovers({ dataProp: changeRequest, currentUserEmail });
  const save = useActionCreator(changeRequestsActions.save);
  const initialValues = useMemo(() => toChangeRequestFormValues(changeRequest), [changeRequest]);
  const schema = changeRequest.formDocument?.formTemplate?.schema || [];

  const async = useAsync<ChangeRequest>();
  if (canEditChangeRequest({ dataProp: changeRequest, currentUserEmail })) {
    return <Redirect to={changeRequestEditPath(changeRequest.id)} />;
  }

  const onSubmit = (values: ChangeRequestFormValues) => {
    const formStateContext = FBFormStateContext as any;
    const dataToSubmit = compareValuesToSubmit(
      initialValues,
      { ...values, formInput: formStateContext?._currentValue },
      toChangeRequestEditRequestBody
    );

    if (isEmpty(dataToSubmit)) {
      return;
    }

    async.start(
      save,
      changeRequest.id,
      dataToSubmit as unknown as ChangeRequestEditRequestBody,
      async,
    );
  };

  _formState?.setMode(FBWorkspaceModeOptions.PREVIEW);

  const summaryPresenterRenderer = (
    props: FormikProps<ChangeRequestFormValues>,
  ) => (
    <ChangeSummaryForm
      asyncState={async.asyncState}
      changeRequest={changeRequest}
      changeOpenStatus={changeOpenStatus}
      schema={schema}
      mode={FBWorkspaceModeOptions.PREVIEW}
      withoutBottomBar={true}
      autosave={autosaveEnabled}
      _formState={_formState}
      canEdit={canEdit}
      canChangeOwnership={canChangeOwnership}
      displayLastSaved={displayLastSaved}
      hideSideBar={hideSideBar}
      {...props}
    />
  );


  return (
    <FBProvider {...{ bookmarkState }}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <FormContext.Provider value={{ submitOnChange: false }}>
            <Formik
              initialValues={toChangeRequestFormValues(changeRequest)}
              onSubmit={onSubmit}
              enableReinitialize={true}
            >
              {summaryPresenterRenderer}
            </Formik>
          </FormContext.Provider>
        </div>
      </div>
    </FBProvider>
  );
};

Container.displayName = "ChangeRequestSummaryContainer";
export default withSMForm(Container);
