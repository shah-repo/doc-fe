import { action, observable, set } from 'mobx';

class FBDatePickerState {
  @observable public date?: string;

  constructor(date?: string) {
    if (!date) { return; }
    set(this, 'date', date);
  }

  @action public setValue = (date?: string | null) => {
    set(this, 'date', date);
  };
}

export default FBDatePickerState;
