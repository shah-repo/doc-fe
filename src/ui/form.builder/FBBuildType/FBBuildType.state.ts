import { reaction } from 'mobx';
import { FBAutocompleteAsyncOption } from '..';
import { LHRBuild } from '../../administration/general.settings/panels/LHRBuild/types';
import FBAutocompleteAsyncStore from '../FBAutocompleteAsync/FBAutocompleteAsync.store';

export class FBBuildTypeState {
  public static getBuildOptions (callback: (options: LHRBuild[]) => void) {
    const dispose = reaction(
      (): LHRBuild[] => {
        const map = FBAutocompleteAsyncStore.data.get(
          FBAutocompleteAsyncOption.buildType,
        );
        return map ? Array.from(map.values()) : [];
      },
      (options) => {
        callback(options);
      },
      { fireImmediately: true },
    );
    return dispose;
  }
}

export default FBBuildTypeState;
