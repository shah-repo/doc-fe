/* eslint-disable no-console */
import { Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { SMFormHOCProps } from "../../../App";
import { withSMForm } from "../../../App/Shifamed/Components/SMForm/SMForm.hoc";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { companySelectors } from "../../../state/ducks/company";
import { FBDocumentRevisionProps } from "../../../state/ducks/documentRevisions/types";
import { AsyncState } from "../../../state/types";
import styles from "../../common/style/styles";
import { FB, FBBookmarkState, FBProvider, FBWorkspaceModeOptions } from "../../form.builder";
import ChangeRequestForm from "./ChangeRequestForm";
import { ChangeRequestFormValues } from "./types";


interface OwnProps {
  initialValues: ChangeRequestFormValues;
  onSubmit: (values: ChangeRequestFormValues) => void;
  asyncState: AsyncState;
  changeRequest?: ChangeRequest;
  doNotPrompt?: boolean;
  chosenForm?: FBDocumentRevisionProps;
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
}) => {
  const bookmarkState = FB.useRef<FBBookmarkState>(FBBookmarkState);
  const autosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);

  useEffect(() => () => {
    changeRequestFormOnScreenContext = React.createContext<boolean>(false);
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
  // console.log(_formState);

  const render = (props: FormikProps<ChangeRequestFormValues>) => (
    <ChangeRequestForm
      asyncState={asyncState}
      changeRequest={changeRequest}
      doNotPrompt={doNotPrompt}
      changeOpenStatus={changeOpenStatus}
      schema={schemaData}
      mode={FBWorkspaceModeOptions.FORM}
      withoutBottomBar={true}
      autosave={autosaveEnabled}
      _formState={_formState}
      {...props}
    />

    // <FBWorkspace
    //   portalContainer={FBContainer}
    //   isPortal={true}
    //   initialValues={cloneDeep(changeRequest?.formInput)}
    //   changeRequest={cloneDeep(changeRequest)}
    //   autosave={autosaveEnabled}
    //   withoutBottomBar={true}
    //   schema={schemaData}
    //   mode="form"
    // >
    //   <AssessmentFormPresenter
    //     asyncState={asyncState}
    //     changeRequest={changeRequest}
    //     chosenForm={chosenForm}
    //     doNotPrompt={doNotPrompt}
    //     sidebar={changeRequest && <Sidebar sidebarList={sidebarList}
    //       isDrawerOpen={isDrawerOpen} setOpen={setOpen} fromEdit={true} />}
    //     {...props}
    //     {...{ FBContainer }}
    //   />
    // </FBWorkspace>

  );

  return (
    <FBProvider {...{ bookmarkState }}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <Formik
            initialValues={initialValues}
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
