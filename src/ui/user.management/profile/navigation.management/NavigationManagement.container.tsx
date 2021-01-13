import { Formik, FormikProps } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { companyActions, companySelectors } from "../../../../state/ducks/company";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import { toNavigationBodyValues, toNavigationIntialValues } from "../../utils/transform";
import NavigationManagementPresenter from "./NavigationManagement.presenter";

export const NavigationManagementContainer: React.FunctionComponent<{}> = ({
}) => {
  // add TAG restriction
  const async = useAsync();
  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);

  const navigationItems = useSelector(companySelectors.getNavigationItems);
  const initialValues = toNavigationIntialValues(navigationItems);

  const onSubmit = (values: any) => {
    async.start(changeCompanyAction, toNavigationBodyValues(values), async);
  };

  const render = (props: FormikProps<any>) => (
    <NavigationManagementPresenter
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
