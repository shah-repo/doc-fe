import { orderBy } from "lodash";
import * as React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as CompanyAvatar } from "../../../assets/images/company_avatar.svg";
import Config from "../../../config";
import { authActions } from "../../../state/ducks/auth";
import { companyActions } from "../../../state/ducks/company";
import { Employee, WhiteLabelingEnv } from "../../../state/ducks/company/types";
import { tableSearchActions } from "../../../state/ducks/tableSearch";
import { HOME_URL } from "../../constants/urls";
import { ThemeEnv } from "../../layout/theme/utils/types";
import { LoginContainerProps } from "../Login.container";
import SwitchCompanyPresenter from "./SwitchCompany.presenter";
import { styles } from "./SwitchCompany.styles";

type Props = LoginContainerProps;

const SwitchCompanyContainer: React.FunctionComponent<Props> = ({
  employees,
}) => {
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
