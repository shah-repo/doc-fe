import { orderBy } from "lodash";
import { default as React, useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as CompanyAvatar } from "../../../assets/images/company_avatar.svg";
import Config from "../../../config";
import { authActions } from "../../../state/ducks/auth";
import { companyActions, companySelectors } from "../../../state/ducks/company";
import { Employee, WhiteLabelingEnv } from "../../../state/ducks/company/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { toastInfo } from "../../components/notifications";
import "../../components/notifications/notifications.css";
import { COMPANY_EMAIL_URL, HOME_URL } from "../../constants/urls";
import { ThemeEnv } from "../../layout/theme/utils/types";
import { LoginContainerProps } from "../Login.container";
import SwitchCompanyPresenter from "./SwitchCompany.presenter";
import { styles } from "./SwitchCompany.styles";

type Props = LoginContainerProps;
const toastConfig = (message) =>
  <span>{message} <a href={`mailto:${COMPANY_EMAIL_URL}`}>{COMPANY_EMAIL_URL}</a></span>;

const SwitchCompanyContainer: React.FunctionComponent<Props> = ({
  employees,
}) => {

  const scheduledForDeletion = useSelector(companySelectors.getScheduledForDeletion);
  const intl = useIntl();

  useEffect(() => {
    scheduledForDeletion &&
  toastInfo((toastConfig(intl.formatMessage({ id: "toast.notification.deletion" }))),
    { position: "top-center", className: "warning-deletion" });
  }, [intl, scheduledForDeletion]);

  const classes = styles();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = (employee: Employee) => () => {
    dispatch(companyActions.selectCompany(employee.company));
    dispatch(authActions.selectEmployee(employee));
    dispatch(authActions.getIotCreds());
    dispatch(authActions.clearNonAuthData());
    dispatch(tableSearchActions.clearAllTables());
    history.push(HOME_URL);
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
