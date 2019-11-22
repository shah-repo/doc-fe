import * as React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactComponent as CompanyAvatar } from "../../../assets/images/company_avatar.svg";
import { authActions } from "../../../state/ducks/auth";
import { companyActions, Employee } from "../../../state/ducks/company";
import Text from "../../components/Text";
import { HOME_URL } from "../../constants/urls";
import { LoginContainerProps } from "../Login.container";
import { styles } from "./SwitchCompany.styles";

export type Props = LoginContainerProps;

const SwitchCompany: React.FunctionComponent<Props> = ({ employees }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = styles();
  const handleClick = (employee: Employee) => () => {
    dispatch(companyActions.selectCompany(employee.company));
    dispatch(authActions.selectEmployee(employee));
    history.push(HOME_URL);
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.title}>
          <Text translation="company.switch.title" />
        </div>
        <div className={classes.subtitle}>
          <Text translation="company.switch.subtitle" />
        </div>
        <div className={classes.companyRows}>
          {employees.map((employee: Employee) => {
            return (
              <button
                key={employee.company.id}
                className={classes.companyButton}
                onClick={handleClick(employee)}
              >
                <div className={classes.company}>
                  {employee.company.whiteLabeling && (
                    <img
                      src={employee.company.whiteLabeling.logo}
                      alt="Avatar"
                      className={classes.avatar}
                    />
                  )}
                  {!employee.company.whiteLabeling && <CompanyAvatar />}
                  <div className={classes.companyName}>
                    {employee.company.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SwitchCompany;
