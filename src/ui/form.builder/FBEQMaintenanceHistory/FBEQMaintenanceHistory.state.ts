import { template } from "lodash";
import { observable } from "mobx";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBEQMaintenanceHistoryState extends FBRequest<any, any>  {
  @observable maintenanceHistory?: any;

  public constructor(id: string) {
    super();
    if (!id) {
      return;
    }
    this.fetchMaintenanceHistory(id);
  }

  public fetchMaintenanceHistory = (id: string) => {
    const urlTpl = template(FBEndpoint.HistoryMaintenance);
    const url = urlTpl({ id });
    this.setUrl(url);
    this.fetch();
  };

}

export default FBEQMaintenanceHistoryState;
