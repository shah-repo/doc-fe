import { orderBy } from 'lodash';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ReactComponent as CompanyAvatar } from '../../../assets/images/company_avatar.svg';
import Config from '../../../config';
import { authActions, authSelectors } from '../../../state/ducks/auth';
import { companyActions, companySelectors } from '../../../state/ducks/company';
import { Employee, WhiteLabelingEnv } from '../../../state/ducks/company/types';
import { toastSuccess } from '../../components/notifications';
import { COMPANY_EMAIL, HOME_URL } from '../../constants/urls';
import { ThemeEnv } from '../../layout/theme/utils/types';
import { LoginContainerProps } from '../Login.container';
import { showPasswordExpiryToast } from '../PasswordExpiryToast';
import SwitchCompanyPresenter from './SwitchCompany.presenter';
import { styles } from './SwitchCompany.styles';

type Props = LoginContainerProps;

const SwitchCompanyContainer: React.FunctionComponent<Props> = ({
  employees,
}) => {
  const intl = useIntl();
  const classes = styles();
  const history = useHistory();
  const dispatch = useDispatch();
  const passwordSoonToExpire = useSelector(authSelectors.getPasswordSoonToExpire);
  const daysUntilPasswordExpires = useSelector(authSelectors.getDaysUntilPasswordExpires);
  const selectedCompanyMobile = useSelector(companySelectors.getSelectedCompany);
  const [inputValue, setInputValue] = React.useState<string>();

  const onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(value);
  };

  const handleClick = (employee: Employee) => () => {
    dispatch(companyActions.selectCompany(employee.company));
    dispatch(authActions.selectEmployee(employee));

    history.push(HOME_URL);

    if (passwordSoonToExpire) {
      showPasswordExpiryToast(daysUntilPasswordExpires);
    }

    employee.company.scheduledForDeletion
    && toastSuccess(
      <div>
        {intl.formatMessage({ id: 'toast.notification.deletion' })}
        <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
      </div>,
      { autoClose: 15000 });
  };
  const companies = orderBy(employees, ['company.name'], ['asc'])
    .filter((employee) => employee.active && (inputValue ? employee.company.name.toLocaleLowerCase().includes((inputValue?.toLowerCase())) : true))
    .map(
      (employee: Employee) => {
        const { company } = employee;
        const whiteLabeling
          = ((company.whiteLabeling || {})[Config.Theme as ThemeEnv] || {}) as WhiteLabelingEnv;

        return (
          <button
            key={company.id}
            className={classes.companyButton}
            onClick={handleClick(employee)}
            id="SwitchCompanyContainer-companies"
          >
            <div className={classes.company}>
              {whiteLabeling.avatar && (
                <img
                  src={whiteLabeling.avatar}
                  alt="Avatar"
                  className={classes.avatar}
                />
              )}
              {!whiteLabeling.avatar && <CompanyAvatar />}
              <div className={classes.companyName}>{company.name}</div>
              {employee.company.id === selectedCompanyMobile.id
              && (
                <span className={classes.selectedIcon}>✓</span>
              )}
            </div>
          </button>
        );
      },
    );
  return (
    <SwitchCompanyPresenter numberOfCompanies={companies.length} onChange={onChange} value={inputValue}>
      {companies}
    </SwitchCompanyPresenter>
  );
};

export default SwitchCompanyContainer;
