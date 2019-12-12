import * as React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as CompanyAvatar } from "../../../assets/images/company_avatar.svg";
import { authActions } from "../../../state/ducks/auth";
import { companyActions, Employee } from "../../../state/ducks/company";
import { HOME_URL } from "../../constants/urls";
import { LoginContainerProps } from "../Login.container";
import SwitchCompanyPresenter from "./SwitchCompany.presenter";
import { styles } from "./SwitchCompany.styles";

export type Props = LoginContainerProps;

const SwitchCompanyContainer: React.FunctionComponent<Props> = ({employees}) => {
  const classes = styles();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = (employee: Employee) => () => {
    dispatch(companyActions.selectCompany(employee.company));
    dispatch(authActions.selectEmployee(employee));
    history.push(HOME_URL);
  };

  const companies =
    employees.map((employee: Employee) => {
    return (
      <button
        key={employee.company.id}
        className={classes.companyButton}
        onClick={handleClick(employee)}
      >
        <div className={classes.company}>
          {employee.company.whiteLabeling.avatar && (
            <img
              src={employee.company.whiteLabeling.avatar}
              alt="Avatar"
              className={classes.avatar}
            />
          )}
          {!employee.company.whiteLabeling.avatar && <CompanyAvatar />}
          <div className={classes.companyName}>
            {employee.company.name}
          </div>
        </div>
      </button>
    );
    });

  return (
    <SwitchCompanyPresenter
      children={companies}
    />
  );
};

export default SwitchCompanyContainer;
