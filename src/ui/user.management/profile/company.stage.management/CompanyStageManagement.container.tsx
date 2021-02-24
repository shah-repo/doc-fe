import { Box } from "@material-ui/core";
import { Formik, FormikProps } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { companyActions, companySelectors } from "../../../../state/ducks/company";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useGetHasTag from "../../../hooks/useGetHasTag";
import { toNumRevisionStageBodyValues, toNumRevisionStageInitialValues } from "../../utils/transform";
import CompanyStageManagementPresenter from "./CompanyStageManagement.presenter";

const CompanyStageManagementContainer: React.FunctionComponent<{}> = ({
}) => {
  const async = useAsync();

  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);
  const canManageCompanyStage = useGetHasTag(GroupTag.COMPANY_CONFIG_DOCUMENT_REV_STAGES);
  const numOfRevStages = useSelector(companySelectors.getCompanyMaxRevisionStage);
  const initialValues = toNumRevisionStageInitialValues(numOfRevStages);

  if (!canManageCompanyStage) {
    return null;
  }

  const onSubmit = (values: any) => {
    async.start(changeCompanyAction, toNumRevisionStageBodyValues(values), async);
  };

  const render = (props: FormikProps<any>) => (
    <CompanyStageManagementPresenter
      asyncState={async.asyncState}
      {...props}
    />
  );

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {render}
      </Formik>
    </Box>
  );
};

export default CompanyStageManagementContainer;
