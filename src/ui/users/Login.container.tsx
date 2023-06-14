import React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import { logo } from '../../common/utils/helpers';
import { authSelectors } from '../../state/ducks/auth';
import { Employee } from '../../state/ducks/company/types';
import { ApplicationState } from '../../state/reducers';
import { toastInfo, toastSuccess } from '../components/notifications';
import { COMPANY_EMAIL, HOME_URL, RESET_PASSWORD_URL } from '../constants/urls';
import LoginPresenter from './Login.presenter';
import SwitchCompanyContainer from './SwitchCompany/SwitchCompany.container';

interface StateProps {
  isUserAuthenticated: boolean
  employees: Employee[]
  hasMultipleCompanies: boolean
  passwordSoonToExpire: boolean
  daysUntilPasswordExpires: number
  isScheduledForDeletion: boolean
}

export type LoginContainerProps = StateProps & Pick<RouteComponentProps, 'location'>;

const LoginContainer: React.FunctionComponent<LoginContainerProps> = (props) => {
  const { from } = props.location.state || { from: { pathname: HOME_URL } };
  const intl = useIntl();

  if (props.isUserAuthenticated) {
    if (props.hasMultipleCompanies) {
      return (
        <SwitchCompanyContainer
          {...props}
        />
      );
    }
    props.passwordSoonToExpire && toastInfo(
      <div>
        Your password will expire in {props.daysUntilPasswordExpires} days.&nbsp;
        <Link to={RESET_PASSWORD_URL}>Reset it now.</Link>
      </div>,
      { autoClose: 10000 });

    props.isScheduledForDeletion
    && toastSuccess(
      <div>
        {intl.formatMessage({ id: 'toast.notification.deletion' })}
        <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
      </div>,
      { autoClose: 15000 });

    return <Redirect to={from} />;
  }

  return (
    <LoginPresenter
      logo={logo}
    />
  );
};

const mapStateToProps = (state: ApplicationState): StateProps => ({
  isUserAuthenticated: authSelectors.isAuthenticated(state),
  employees: authSelectors.employees(state),
  hasMultipleCompanies: authSelectors.hasMultipleCompanies(state),
  passwordSoonToExpire: authSelectors.getPasswordSoonToExpire(state),
  daysUntilPasswordExpires: authSelectors.getDaysUntilPasswordExpires(state),
  isScheduledForDeletion: authSelectors.getIsScheduledForDeletion(state),
});

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(LoginContainer);
