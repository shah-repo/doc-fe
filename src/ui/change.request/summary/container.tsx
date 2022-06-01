import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { ReactComponent as BookmarkIcon } from "../../../assets/images/bookmark.svg";
import { ReactComponent as TimelineIcon } from "../../../assets/images/history.svg";
import { authSelectors } from "../../../state/ducks/auth";
import { GroupTag } from "../../../state/ducks/auth/types";
import { changeRequestsActions } from "../../../state/ducks/changeRequest";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { DataProps } from "../../../state/ducks/common/types";
import { companySelectors } from "../../../state/ducks/company";
import Sidebar from "../../common/components/Sidebar";
import styles from "../../common/style/styles";
import { FormContext } from "../../components/forms/FormContext";
import Bookmarks from "../../documentRevision/Sidebar/Bookmarks.new";
import { Sidebar as SidebarTypes } from "../../documentRevision/Sidebar/types";
import { FB, FBBookmarkState, FBProvider, FBWorkspace } from "../../form.builder";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useGetHasTag from "../../hooks/useGetHasTag";
import ChangeRequestAuditContainer from "../audit/Audit.container";
import { toChangeRequestFormValues, toChangeRequestUpdateRequestBody } from "../form/transform";
import { ChangeRequestFormValues } from "../form/types";
import { canChangeCROwner, canEditApprovers, canEditChangeRequest } from "../utils/helpers";
import { changeRequestEditPath } from "../utils/paths";
import Presenter from "./presenter";
import SummaryHeader from "./SummaryHeader";

interface OwnProps extends DataProps<ChangeRequest> {
  currentUserEmail: string;
}
type Props = OwnProps;

const Container: React.FunctionComponent<Props> = ({
  dataProp,
  currentUserEmail,
}) => {
  let errors;
  const FBContainer = React.useRef(null);
  const bookmarkState = FB.useRef<FBBookmarkState>(FBBookmarkState);

  /*   const [summaryDocumentTypeGroups, setSummaryDocTypeGroups] = useState<any[]>([]);
 */
  const [isDrawerOpen, setOpen] = React.useState(true);
  const classes = styles({ isDrawerOpen });
  useDocumentTitle(dataProp.crId);
  const intl = useIntl();
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const autosaveEnabled = useSelector(companySelectors.getAutosaveEnabled);
  const isCompanyAdmin = useGetHasTag(GroupTag.USER_MANAGEMENT);
  const hasOwnershipTag = useGetHasTag(GroupTag.OWNERSHIP_CHANGE);

  const canChangeOwnerShip = canChangeCROwner(
    dataProp.state,
    currentEmployeeId,
    dataProp.owner.id,
    isCompanyAdmin,
    hasOwnershipTag);
  const canEdit = canEditApprovers({ dataProp, currentUserEmail });
  const save = useActionCreator(changeRequestsActions.save);
  /*   const loadGroupsByStage = useActionCreator(documentRevisionsActions.loadGroupsByStage);
 */  const schema = dataProp.formDocument?.formTemplate?.schema || [];

  /*   const asyncGroups = useAsync({
    onSuccess: (response: Group[] = []) => {
      setSummaryDocTypeGroups([
        ...summaryDocumentTypeGroups,
        response,
      ].flat());
    },
  }); */

  /*   useEffect(() => {
    dataProp.documentRevisions.map((docRev) => asyncGroups.start(
      loadGroupsByStage,
      docRev.id,
      asyncGroups,
    ));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProp]); */

  const async = useAsync<ChangeRequest>();
  if (canEditChangeRequest({ dataProp, currentUserEmail })) {
    return <Redirect to={changeRequestEditPath(dataProp.id)} />;
  }

  const onSubmit = (values: ChangeRequestFormValues) => {
    async.start(
      save,
      dataProp.id,
      toChangeRequestUpdateRequestBody(values),
      async,
    );
  };

  const summaryPresenterRenderer = (
    props: FormikProps<ChangeRequestFormValues>,
  ) => {
    errors = props.errors;
    return (
      <FBWorkspace
        portalContainer={FBContainer}
        isPortal={true}
        initialValues={dataProp.formInput}
        changeRequest={dataProp}
        autosave={autosaveEnabled}
        schema={schema}
        mode={"preview"}
      >
        <Form>
          <Presenter
            dataProp={dataProp}
            asyncState={async.asyncState}
            canEdit={canEdit}
            canChangeOwnerShip={canChangeOwnerShip}
            {...props}
            {...{ FBContainer }}
          />
        </Form>
      </FBWorkspace>
    );
  };

  const summaryFormikRenderer = () => (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik
        initialValues={toChangeRequestFormValues(dataProp)}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {summaryPresenterRenderer}
      </Formik>
    </FormContext.Provider>
  );

  const sidebarList: SidebarTypes[] = [
    {
      icon: <TimelineIcon />,
      type: "history",
      details: {
        shouldShow: Boolean(dataProp),
        dataCy: "timeline-icon",
        title: intl.formatMessage({
          id: "document.revision.history",
        }),
        component: dataProp ? <ChangeRequestAuditContainer changeRequest={dataProp} isDrawerOpen={isDrawerOpen} />
          : null,
      },
    }, {
      icon: <BookmarkIcon />,
      type: "bookmarks",
      details: {
        shouldShow: true,
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
      <SummaryHeader {...{ dataProp, canChangeOwnerShip, asyncState: async.asyncState, errors, canEdit }}/>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          {summaryFormikRenderer()}
        </div>
        <Sidebar sidebarList={sidebarList} isDrawerOpen={isDrawerOpen} setOpen={setOpen} />
      </div>
    </FBProvider>
  );
};

Container.displayName = "ChangeRequestSummaryContainer";
export default Container;
