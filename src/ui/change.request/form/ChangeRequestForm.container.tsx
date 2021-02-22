import { Formik, FormikProps } from "formik";
import { cloneDeep } from "lodash";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { ReactComponent as BookmarkIcon } from "../../../assets/images/bookmark.svg";
import { ReactComponent as TimelineIcon } from "../../../assets/images/history.svg";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { FBDocumentRevisionProps } from "../../../state/ducks/documentRevisions";
import { AsyncState } from "../../../state/types";
import DocumentRevisionOutputInfo from "../../documentRevision/formBuilder/DocumentRevisionOutputInfo";
import Bookmarks from "../../documentRevision/Sidebar/Bookmarks";
import SidebarContainer from "../../documentRevision/Sidebar/Sidebar.container";
import { Sidebar } from "../../documentRevision/Sidebar/types";
import { FB, FBBookmarkState, FBProvider, FBWorkspace } from "../../form.builder";
import ChangeRequestAuditContainer from "../audit/Audit.container";
import AssessmentFormPresenter from "./assessmentForm/AssessmentForm.presenter";
import styles from "./styles";
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

type ChangeRequestFormContainerProps = OwnProps;

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
  const FBContainer = React.useRef(null);
  const bookmarkState = FB.useRef<FBBookmarkState>(FBBookmarkState);

  useEffect(() => () => {
    changeRequestFormOnScreenContext = React.createContext<boolean>(false);
  }, []);

  const intl = useIntl();
  const [isDrawerOpen, setOpen] = React.useState(true);
  const classes = styles({ isDrawerOpen });
  const schemaData = changeRequest
    ? changeRequest.formDocument?.formTemplate?.schema
    : chosenForm?.formTemplate?.schema;

  const render = (props: FormikProps<ChangeRequestFormValues>) => (
    <FBWorkspace
      portalContainer={FBContainer}
      initialValues={cloneDeep(changeRequest?.formInput)}
      changeRequest={cloneDeep(changeRequest)}
      autosave={true}
      schema={schemaData}
      mode="form"
    >
      <AssessmentFormPresenter
        asyncState={asyncState}
        changeRequest={changeRequest}
        doNotPrompt={doNotPrompt}
        {...props}
        {...{ FBContainer }}
      />
      <DocumentRevisionOutputInfo formDocument={chosenForm || changeRequest?.formDocument} />
    </FBWorkspace>

  );

  const sidebarList: Sidebar[] = [
    {
      icon: <TimelineIcon />,
      type: "history",
      details: {
        dataCy: "timeline-icon",
        title: intl.formatMessage({
          id: "document.revision.history",
        }),
        component: changeRequest ? <ChangeRequestAuditContainer {...{ changeRequest }} />
          : null,
      },
    },
    {
      icon: <BookmarkIcon />,
      type: "bookmarks",
      details: {
        dataCy: "bookmark-icon",
        title: intl.formatMessage({
          id: "document.revision.bookmarks",
        }),
        component: <Bookmarks />,
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
        {changeRequest && <SidebarContainer {...{ isDrawerOpen, setOpen, sidebarList }} />}
      </div>
    </FBProvider>
  );
};

export default ChangeRequestFormContainer;
