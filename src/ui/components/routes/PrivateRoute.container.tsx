import queryString from 'query-string';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, RouteProps, useHistory, useLocation } from 'react-router-dom';
import { authActions, authSelectors } from '../../../state/ducks/auth';
import { companyActions } from '../../../state/ducks/company';
import PrivateRoutePresenter from './PrivateRoute.presenter';

interface OwnProps extends RouteProps {
  component: React.ComponentType
}

type Props = OwnProps;

const PrivateRouteContainer: React.FunctionComponent<Props> = ({
  component: Component,
  ...rest
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const companyId = useMemo(() => queryString.parse(location.search).companyId as string, [location.search]);
  const isUserAuthenticated = useSelector(authSelectors.isAuthenticated);
  const employees = useSelector(authSelectors.employees);
  const render = (props: any) => (
    <PrivateRoutePresenter {...props} component={Component} isAuthenticated={isUserAuthenticated} />
  );

  if (companyId) {
    const employee = employees.find((employee) => employee.company.id === companyId);

    if (employee) {
      dispatch(companyActions.selectCompany(employee.company));
      dispatch(authActions.selectEmployee(employee));
    }

    history.replace(location.pathname);
  }

  return (
    <Route {...rest} render={render} />
  );
};

export default PrivateRouteContainer;
