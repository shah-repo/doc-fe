import { Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { SMFormHOCProps } from "../../../App";
import { withSMForm } from "../../../App/Shifamed/Components/SMForm/SMForm.hoc";
import { ReactComponent as BookmarkIcon } from "../../../assets/images/bookmark.svg";
import { ReactComponent as EyeIcon } from "../../../assets/images/eye-icon-references.svg";
import { ReactComponent as TimelineIcon } from "../../../assets/images/history.svg";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { companySelectors } from "../../../state/ducks/company";
import { FBDocumentRevisionProps } from "../../../state/ducks/documentRevisions/types";
import { AsyncState } from "../../../state/types";
import styles from "../../common/style/styles";
import Bookmarks from "../../documentRevision/Sidebar/Bookmarks.new";
import { Sidebar as SidebarTypes } from "../../documentRevision/Sidebar/types";
import { FB, FBBookmarkState, FBProvider } from "../../form.builder";
import ChangeRequestAuditContainer from "../audit/Audit.container";
import CRReferences from "../references/Reference";
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
}) => {
  const bookmarkState = FB.useRef<FBBookmarkState>(FBBookmarkState);
  const autosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);

  useEffect(() => () => {
    changeRequestFormOnScreenContext = React.createContext<boolean>(false);
  }, []);

  const intl = useIntl();

  const changeOpenStatus = (isDrawerOpen) => {
    setOpen(isDrawerOpen);
  };

  const [isDrawerOpen, setOpen] = React.useState(true);
  const classes = styles({ isDrawerOpen });

  const schemaData = changeRequest
    ? changeRequest.formDocument?.formTemplate?.schema
    : chosenForm?.formTemplate?.schema;

  const render = (props: FormikProps<ChangeRequestFormValues>) => (
    <ChangeRequestForm
      asyncState={asyncState}
      changeRequest={changeRequest}
      doNotPrompt={doNotPrompt}
      sidebarList={sidebarList}
      changeOpenStatus={changeOpenStatus}
      schema={schemaData}
      mode="form"
      withoutBottomBar={true}
      autosave={autosaveEnabled}
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

  const sidebarList: SidebarTypes[] = [
    {
      icon: <EyeIcon />,
      type: "references",
      details: {
        shouldShow: true,
        title:
          intl?.formatMessage({
            id: "common.references",
          }) || "",
        component: (
          <CRReferences
            chosenForm={chosenForm}
            changeRequest={changeRequest}
          />
        ),
      },
    },
    {
      icon: <TimelineIcon />,
      type: "history",
      details: {
        shouldShow: Boolean(changeRequest),
        dataCy: "timeline-icon",
        title: intl.formatMessage({
          id: "document.revision.history",
        }),
        component: changeRequest ? <ChangeRequestAuditContainer {...{ changeRequest, isDrawerOpen }} />
          : null,
      },
    },
    {
      icon: <BookmarkIcon />,
      type: "bookmarks",
      details: {
        shouldShow: true,
        dataCy: "bookmark-icon",
        title: intl.formatMessage({
          id: "document.revision.bookmarks",
        }),
        component: <Bookmarks fromAR={true} />,
      },
    },
  ];

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
