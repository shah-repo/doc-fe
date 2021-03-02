import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBLHRStepState {
  // MARK: @api
  public startMpiApi = new FBRequest<any, any>(FBEndpoint.startMpi);

  // MARK: @helpers
  public startMpi = (woId: string, mpiId: string, fieldId: string ) => {
    this.startMpiApi.set({
      url: FBEndpoint.startMpi,
      method: "post",
      body: {
        wo: {
          id: woId,
        },
        mpi: {
          id: mpiId,
        },
        fieldId,
      },
    });
  };
}

export default FBLHRStepState;
