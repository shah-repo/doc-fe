import { datadogRum } from "@datadog/browser-rum";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../state/reducers";

function deleteCookie(name) {
  document.cookie = name + "=" +
      ";domain=" + window.location.hostname +
      ";path=/" +
      ";expires=" + new Date().toUTCString();
}

const companyIdSelector = (state: ApplicationState) => state.company.companyMine.id;
const companyNameSelector = (state: ApplicationState) => state.company.companyMine.name;
const employeeIdSelector = (state: ApplicationState) => state.auth.user.employeeId;
const userNameSelector = (state: ApplicationState) => state.auth.user.name;

export const DataDog: React.FunctionComponent<any> = () => {
  const companyId = useSelector(companyIdSelector);
  const companyName = useSelector(companyNameSelector);
  const employeeId = useSelector(employeeIdSelector);
  const userName = useSelector(userNameSelector);

  useEffect(() => {
    if (
      companyId.length === 0 ||
      companyName.length === 0 ||
      employeeId.length === 0) {
      datadogRum.removeUser();
    } else {
      deleteCookie("_dd_s");
      datadogRum.setUser({
        id: employeeId,
        name: `${userName} (${companyName})`,
      });
    }
  }, [companyId, companyName, employeeId, userName]);

  return null;

};
