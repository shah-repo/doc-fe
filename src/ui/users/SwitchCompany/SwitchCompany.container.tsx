import { orderBy } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { ReactComponent as CompanyAvatar } from "../../../assets/images/company_avatar.svg";
import Config from "../../../config";
import { authActions, authSelectors } from "../../../state/ducks/auth";
import { companyActions, companySelectors } from "../../../state/ducks/company";
import { Employee, WhiteLabelingEnv } from "../../../state/ducks/company/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { toastInfo, toastSuccess } from "../../components/notifications";
import { COMPANY_EMAIL, HOME_URL, RESET_PASSWORD_URL } from "../../constants/urls";
import { ThemeEnv } from "../../layout/theme/utils/types";
import { LoginContainerProps } from "../Login.container";
import SwitchCompanyPresenter from "./SwitchCompany.presenter";
import { styles } from "./SwitchCompany.styles";

export const toastCompanyDeletion = (message) =>
  <span>{message} <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a></span>;

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
  const isScheduledForDeletion = useSelector(companySelectors.getScheduledForDeletion);

  const handleClick = (employee: Employee) => () => {
    dispatch(companyActions.selectCompany(employee.company));
    dispatch(authActions.selectEmployee(employee));
    dispatch(authActions.getIotCreds());
    dispatch(authActions.clearNonAuthData());
    dispatch(tableSearchActions.clearAllTables());
    history.push(HOME_URL);
    passwordSoonToExpire && toastInfo(
      <div>
        Your password will expire in {daysUntilPasswordExpires} days.&nbsp;
        <Link to={RESET_PASSWORD_URL}>Reset it now.</Link>
      </div>,
      { autoClose: 10000 });

    isScheduledForDeletion &&
    toastSuccess((toastCompanyDeletion(intl.formatMessage({ id: "toast.notification.deletion" }))),
      { autoClose: 20000 });
  };
  const companies = orderBy(employees, ["company.name"], ["asc"])
    .filter((employee) => employee.active)
    .map(
      (employee: Employee) => {
        const { company } = employee;
        const whiteLabeling =
          ((company.whiteLabeling || {})[Config.Theme as ThemeEnv] || {}) as WhiteLabelingEnv;

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
            </div>
          </button>
        );
      },
    );
  return (
    <SwitchCompanyPresenter
      // eslint-disable-next-line react/no-children-prop
      children={companies}
      numberOfCompanies={companies.length}
    />
  );
};

export default SwitchCompanyContainer;
