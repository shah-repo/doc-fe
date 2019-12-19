import { authActions } from "../../../state/ducks/auth";
import { apiAction } from "../../factories";
import { SESSION_DETAILS_URL } from "../auth/constants";
import { SELECT_COMPANY } from "./constants";
import { Company, SelectCompanyAction } from "./types";

const selectCompany = (company: Company): SelectCompanyAction => ({
  type: SELECT_COMPANY,
  payload: company,
});

const queryCompany = (employeeId: string) =>
  apiAction({
    url: SESSION_DETAILS_URL,
    method: "get",
    onSuccess: (data: any, dispatch) => {
      const employee = data.employees.find(
        (employee: any) => employee.id === employeeId,
      );
      const company = employee.company;
      dispatch(selectCompany(company));
      dispatch(authActions.getIotCreds());
    },
  });

export default {
  selectCompany,
  queryCompany,
};
