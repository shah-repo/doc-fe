import { observable, set } from "mobx";
import { StartMpiBody } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";

class FBLHRStepState {
  // MARK: @api
  public startMpiApi = new FBRequest<DocumentRevision, StartMpiBody>(FBEndpoint.StartMpi);

  // MARK @config
  @observable public stepLHRs?: DocumentRevision;
  @observable public isHovering = false;

  public constructor(lhrs?: DocumentRevision) {
    this.stepLHRs = lhrs;
  }

  // MARK: @helpers
  public setLHRs = (lhrs) => set(this, "stepLHRs", lhrs);

  public setIsHovering = (isHovering: boolean) => set(this, "isHovering", isHovering);

  public startMpi = (fieldId: string, startQuantity: number, woId?: string, mpiId?: string ) => {
    if (!woId || !mpiId) { return; }
    this.startMpiApi.set({
      url: FBEndpoint.StartMpi,
      method: "post",
      body: {
        wo: {
          id: woId,
        },
        mpi: {
          id: mpiId,
        },
        fieldId,
        startQuantity,
      },
    });
  };
}

export default FBLHRStepState;
