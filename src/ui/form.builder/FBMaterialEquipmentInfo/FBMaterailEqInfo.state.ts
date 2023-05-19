import { computed } from 'mobx';
import { FBEndpoint } from '../defaults/FBEndpoint';
import FBRequest from '../FBApi/FBApi.request';
import { MaterialAndEquipment } from './FBMaterailEqInfo.types';

class FBMaterailEqInfoState {
  private currentApi = new FBRequest<MaterialAndEquipment, null>(FBEndpoint.MaterialAndEquipment);
  private parentApi = new FBRequest<MaterialAndEquipment, null>(FBEndpoint.MaterialAndEquipment);

  @computed public get currentItems() {
    return this.currentApi.data;
  }
  @computed public get parentItems() {
    return this.parentApi.data;
  }
  @computed public get loading() {
    return this.currentApi.loading || this.parentApi.loading;
  }

  public fetchParentItems(id: string) {
    this.parentApi.set({
      method: 'get',
      urlValues: { id },
    });
  }

  public fetchCurrentItems(id: string) {
    this.currentApi.set({
      method: 'get',
      urlValues: { id },
    });
  }
}

export default FBMaterailEqInfoState;
