import { apiAction } from "../../factories";
import { SESSION_DETAILS_URL } from "../auth/constants";
import { SELECT_COMPANY } from "./constants";
import { Company, SelectCompanyAction } from "./types";

const selectCompany = (company: Company): SelectCompanyAction => ({
  type: SELECT_COMPANY,
  payload: company,
});

const queryCompany = () =>
  apiAction({
    url: SESSION_DETAILS_URL,
    method: "get",
    onSuccess: (data: any, dispatch) => {
      const { company } = data.employees[0];
      dispatch(selectCompany(company));
    },
    onFailure: (err, dispatch) => {
      // console.log(err);
    },
  });

export default {
  selectCompany,
  queryCompany,
};
