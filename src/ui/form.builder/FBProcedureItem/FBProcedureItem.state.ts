import { action, observable, set } from 'mobx';

class FBProcedureItemState {
  // MARK: @observables
  @observable public lotDocId: string;
  // MARK: @constructor
  public constructor (value: string) {
    this.lotDocId = value;
  }

  // MARK: @actions
  @action public setLotDocId = (value?: string) => {
    set(this, 'lotDocId', value);
  };
}
export default FBProcedureItemState;
