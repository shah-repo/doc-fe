import { StartMpiBody } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBLHRStepState {
  // MARK: @api
  public startMpiApi = new FBRequest<DocumentRevision, StartMpiBody>(FBEndpoint.startMpi);

  // MARK: @helpers
  public startMpi = (fieldId: string, woId?: string, mpiId?: string ) => {
    if (!woId || !mpiId) { return; }
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
