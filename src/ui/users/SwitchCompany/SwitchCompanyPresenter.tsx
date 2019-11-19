import * as React from "react";
import { useHistory } from "react-router-dom";
import { companyActions, Employees } from "../../../state/ducks/company";
import Text from "../../components/Text";
import { HOME_URL } from "../../constants/urls";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { LoginContainerProps } from "../Login.container";
import { styles } from "./SwitchCompanyPresenter.styles";

export type Props = LoginContainerProps;

const SwitchCompanyPresenter: React.FunctionComponent<Props> = ({ companies }) => {
  const selectCompanyAction = useActionCreator(companyActions.selectCompany);
  const selectCompanyAsync = useAsync();
  const history = useHistory();
  const classes = styles();
  function handleClick() {
    history.push(HOME_URL);
  }
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
            {companies.map((employee: Employees) => {
              return (
                <button
                  key={employee.company.id}
                  className={classes.companyButton}
                  onClick={() => (
                      selectCompanyAsync.start(selectCompanyAction, employee.company),
                      handleClick())
                  }
                >
                  <div className={classes.company}>
                  {employee.company.whiteLabeling &&
                    <img
                      src={employee.company.whiteLabeling.logo}
                      alt="Avatar"
                      className={classes.avatar}
                    />
                  }
                  <div className={classes.companyName} >{employee.company.name}</div>
                  </div>
                </button>
              );
            },
            )}
            </div>
        </div>
    </div>
  );
};

export default SwitchCompanyPresenter;
