import { Formik, FormikProps } from "formik";
import { cloneDeep } from "lodash";
import { useObserver } from "mobx-react";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { SMFormHOCProps } from "../../../App";
import { withSMForm } from "../../../App/Shifamed/Components/SMForm/SMForm.hoc";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { companySelectors } from "../../../state/ducks/company";
import { FBDocumentRevisionProps } from "../../../state/ducks/documentRevisions/types";
import { AsyncState } from "../../../state/types";
import styles from "../../common/style/styles";
import { FB, FBBookmarkState, FBProvider, FBWorkspaceModeOptions } from "../../form.builder";
import FBDataStore from "../../form.builder/FBStore/FBDataStore";
import ChangeRequestForm from "./ChangeRequestForm";
import { ChangeRequestFormValues } from "./types";


interface OwnProps {
  initialValues: ChangeRequestFormValues;
  onSubmit: (values: ChangeRequestFormValues) => void;
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
  chosenForm?: FBDocumentRevisionProps;
  hideSideBar?: boolean;
  currentDocRevId? : string;
  inDialog?: boolean;
}

export let changeRequestFormOnScreenContext = React.createContext<boolean>(false);

type ChangeRequestFormContainerProps = OwnProps & SMFormHOCProps;

const ChangeRequestFormContainer: React.FunctionComponent<
  ChangeRequestFormContainerProps
> = ({
  onSubmit,
  asyncState,
  initialValues,
  changeRequest,
  doNotPrompt,
  chosenForm,
  _formState,
  hideSideBar = false,
  currentDocRevId,
  inDialog = false,
}) => {
  const bookmarkState = FB.useRef<FBBookmarkState>(FBBookmarkState);
  const autosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);

  const calcInitialValues = useMemo(() => {
    initialValues.formInput = FBDataStore?.refreshData?.changeRequest?.formInput ?? initialValues.formInput;

    return {
      ...initialValues,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, FBDataStore?.refreshData]);

  useObserver(() => {
    calcInitialValues.formInput = FBDataStore?.refreshData?.changeRequest?.formInput ?? calcInitialValues.formInput;
  });

  const formInput = useMemo(() =>
    calcInitialValues ? cloneDeep(calcInitialValues.formInput) : {}
  , [calcInitialValues]);

  useEffect(() => () => {
    changeRequestFormOnScreenContext = React.createContext<boolean>(false);
    FBDataStore.setRefreshData(undefined);
  }, []);

  const changeOpenStatus = (isDrawerOpen) => {
    setOpen(isDrawerOpen);
  };

  const [isDrawerOpen, setOpen] = React.useState(true);
  const classes = styles({ isDrawerOpen });

  const schemaData = changeRequest
    ? changeRequest.formDocument?.formTemplate?.schema
    : chosenForm?.formTemplate?.schema;

  _formState?.setMode(FBWorkspaceModeOptions.FORM);

  const render = (props: FormikProps<ChangeRequestFormValues>) => (
    <ChangeRequestForm
      formValues={props}
      asyncState={asyncState}
      changeRequest={changeRequest}
      doNotPrompt={doNotPrompt}
      changeOpenStatus={changeOpenStatus}
      schema={schemaData}
      mode={FBWorkspaceModeOptions.FORM}
      withoutBottomBar={true}
      autosave={autosaveEnabled}
      _formState={_formState}
      formInput={formInput}
      hideSideBar={hideSideBar}
      currentDocRevId={currentDocRevId}
      inDialog={inDialog}
      {...props}
    />
  );

  return (
    <FBProvider {...{ bookmarkState }}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <Formik
            initialValues={calcInitialValues}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {render}
          </Formik>
        </div>
      </div>
    </FBProvider>
  );
};

export default withSMForm(ChangeRequestFormContainer);
