import { Grid } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { ReactComponent as BookmarkIcon } from "../../../assets/images/bookmark.svg";
import { ReactComponent as TimelineIcon } from "../../../assets/images/history.svg";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { AsyncState } from "../../../state/types";
import Bookmarks from "../../documentRevision/Sidebar/Bookmarks";
import SidebarContainer from "../../documentRevision/Sidebar/Sidebar.container";
import { FBSchemaProps, FBWorkspace } from "../../form.builder";
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
  schema?: FBSchemaProps[];
}

type ChangeRequestFormContainerProps = OwnProps;

export const ChangeRequestFormContainer: React.FunctionComponent<
ChangeRequestFormContainerProps
> = ({
  onSubmit,
  asyncState,
  initialValues,
  changeRequest,
  doNotPrompt,
  schema,
}) => {
  const FBContainer = React.useRef(null);
  const intl = useIntl();
  const url = useLocation();
  const [sidebar, openSidebar] = useState<boolean>(true);
  const classes = styles({ sidebar });
  const schemaData = changeRequest ? changeRequest.formDocument?.formTemplate?.schema : schema;

  const render = (props: FormikProps<ChangeRequestFormValues>) => (
    <FBWorkspace
      portalContainer={FBContainer}
      initialValues={changeRequest?.formInput}
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
    </FBWorkspace>

  );

  const sidebarList = [
    {
      icon: <TimelineIcon />,
      details: {
        title: intl.formatMessage({
          id: "document.revision.history",
        }),
        component: changeRequest ? <ChangeRequestAuditContainer changeRequestId={changeRequest.id} />
          : null,
      },
    },
    {
      icon: <BookmarkIcon />,
      details: {
        title: intl.formatMessage({
          id: "document.revision.bookmarks",
        }),
        component: <Bookmarks location={url} schema={schemaData} />,
      },
    },
  ];

  return (
    <Grid container={true} className={classes.whiteContainer}>
      <Grid item={true} xs={changeRequest ? (sidebar ? 9 : 11) : 12} className={classes.backColor}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {render}
        </Formik>
      </Grid>
      {changeRequest && <SidebarContainer {...{ sidebar, openSidebar, sidebarList }}/>}
    </Grid>
  );
};

export default ChangeRequestFormContainer;
