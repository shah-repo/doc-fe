import {
    withStyles, WithStyles,
  } from "@material-ui/core";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { companyActions, Employees } from "../../../state/ducks/company";
import { HOME_URL } from "../../constants/urls";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import { LoginContainerProps } from "../Login.container";
import styles from "./SwitchCompanyPresenter.styles";

export type Props = LoginContainerProps & WithStyles<typeof styles>;

const SwitchCompanyPresenter: React.FunctionComponent<Props> = ({ classes, companies }) => {
  const selectCompanyAction = useActionCreator(companyActions.selectCompany);
  const selectCompanyAsync = useAsync();
  const history = useHistory();
  function handleClick() {
    history.push(HOME_URL);
  }
  return (
    <div className={classes.root}>
        <div className={classes.container}>
            <div className={classes.title}>Switch Company</div>
            <div className={classes.subtitle}>Select a company below to sign-in to</div>
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
                  {employee.company.name}
                </button>
              );
            },
            )}
            </div>
        </div>
    </div>
  );
};

export default withStyles(styles)(SwitchCompanyPresenter);
