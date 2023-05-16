import { action, observable, set } from 'mobx';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';
import { AvailableMaintenanceForm, ProposedDocIdBody } from '..';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';

class FBEQMaintenanceState {
  @observable public newPMDisabled?: boolean;
  @observable public newPMLoading?: boolean;

  public availableMaintenanceFormsApi = new FBRequest<AvailableMaintenanceForm[], null>(
    FBEndpoint.FecthAvailableMaintenanceForms
  );
  public proposedIdApi = new FBRequest<ProposedDocIdBody, null>(FBEndpoint.FetchDocId);
  public maintenanceHistoryApi = new FBRequest<Record<string, DocumentRevision[]>, null>(FBEndpoint.HistoryMaintenance);

  @action public setNewPMDisabled = (value: boolean) => set(this, 'newPMDisabled', value);
  @action public setNewPMLoading = (value: boolean) => set(this, 'newPMLoading', value);

  public getAvailableMaintenanceForms = () => this.availableMaintenanceFormsApi.set({ method: 'get' });

  public getProposedId = (documentTypeId: string) => {
    this.proposedIdApi.set({ urlValues: { documentTypeId } });
    return this.proposedIdApi.fetch();
  };

  public getMaintenanceHistory = (id: string) => {
    this.maintenanceHistoryApi.set({ urlValues: { id } });
    return this.maintenanceHistoryApi.fetch();
  };
}

export default FBEQMaintenanceState;
