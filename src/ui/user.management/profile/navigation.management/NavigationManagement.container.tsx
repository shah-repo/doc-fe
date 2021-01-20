import { Formik, FormikProps } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { GroupTag } from "../../../../state/ducks/auth/types";
import { Company, companyActions, companySelectors } from "../../../../state/ducks/company";
import { HOME_URL } from "../../../constants/urls";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import useGetHasTag from "../../../hooks/useGetHasTag";
import { toNavigationBodyValues, toNavigationIntialValues } from "../../utils/transform";
import NavigationManagementPresenter from "./NavigationManagement.presenter";

export const NavigationManagementContainer: React.FunctionComponent<{}> = ({
}) => {
  const dispatch = useDispatch();

  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);
  const canManageNavigation = useGetHasTag(GroupTag.COMPANY_CONFIG_NAVIGATION);
  const navigationItems = useSelector(companySelectors.getNavigationItems);
  const initialValues = toNavigationIntialValues(navigationItems);

  const async = useAsync({
    onSuccess: (data?: Company) => {
      if (!data) {
        return;
      }
      dispatch(companyActions.selectCompany(data));
    },
  });

  if (!canManageNavigation) {
    return <Redirect to={HOME_URL} />;
  }

  const onSubmit = (values: any) => {
    async.start(changeCompanyAction, toNavigationBodyValues(values), async);
  };

  const render = (props: FormikProps<any>) => (
    <NavigationManagementPresenter
      asyncState={async.asyncState}
      {...props}
    />
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {render}
    </Formik>
  );
};

export default NavigationManagementContainer;
