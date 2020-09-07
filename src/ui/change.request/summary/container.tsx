import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import { ReactComponent as BookmarkIcon } from "../../../assets/images/bookmark.svg";
import { ReactComponent as TimelineIcon } from "../../../assets/images/history.svg";
import { authSelectors } from "../../../state/ducks/auth";
import { GroupTag } from "../../../state/ducks/auth/types";
import { ChangeRequest, changeRequestsActions } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { FormContext } from "../../components/forms/FormContext";
import Bookmarks from "../../documentRevision/Sidebar/Bookmarks";
import SidebarContainer from "../../documentRevision/Sidebar/Sidebar.container";
import { FBWorkspace } from "../../form.builder";
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
import ChangeRequestSummarySockets from "./sockets";
import styles from "./styles";


interface OwnProps extends DataProps<ChangeRequest> {
  currentUserEmail: string;
}
export type Props = OwnProps;

export const Container: React.FunctionComponent<Props> = ({
  dataProp,
  currentUserEmail,
}) => {
  const FBContainer = React.useRef(null);

  /*   const [summaryDocumentTypeGroups, setSummaryDocTypeGroups] = useState<any[]>([]);
 */
  const [isDrawerOpen, setOpen] = React.useState(true);
  const url = useLocation();
  const classes = styles({ isDrawerOpen });
  useDocumentTitle(dataProp.crId);
  const intl = useIntl();
  const currentEmployeeId = useSelector(authSelectors.currentEmployeeId);
  const isCompanyAdmin = useGetHasTag(GroupTag.USER_MANAGEMENT);
  const canChangeOwnerShip = canChangeCROwner(dataProp.state, currentEmployeeId, dataProp.owner.id, isCompanyAdmin);
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
  ) => (
    <FBWorkspace
      portalContainer={FBContainer}
      initialValues={dataProp.formInput}
      changeRequest={dataProp}
      autosave={true}
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

  const sidebarList = [
    {
      icon: <TimelineIcon />,
      details: {
        dataCy: "timeline-icon",
        title: intl.formatMessage({
          id: "document.revision.history",
        }),
        component: dataProp ? <ChangeRequestAuditContainer changeRequestId={dataProp.id} />
          : null,
      },
    }, {
      icon: <BookmarkIcon />,
      details: {
        dataCy: "bookmark-icon",
        title: intl.formatMessage({
          id: "document.revision.bookmarks",
        }),
        component: <Bookmarks location={url} schema={schema} />,
      },
    },
  ];

  return (
    <div className={classes.root}>
      <ChangeRequestSummarySockets crId={dataProp.crId} />
      <div className={classes.appFrame}>
        {summaryFormikRenderer()}
      </div>
      <SidebarContainer {...{ isDrawerOpen, setOpen, sidebarList }} />
    </div>
  );
};

Container.displayName = "ChangeRequestSummaryContainer";
export default Container;
