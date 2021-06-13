
class FBLockState {

  // MARK: @constructor
  // @observable public lockApi = new FBRequest<FBLockBody[], null>();
  // @observable public lockFieldsApi = new FBRequest<FBLockData, FBLockBody>();
  // @observable public lockFieldsExpireApi = new FBRequest<null, FBLockBody>();

  // MARK: @constructor
  public constructor(id?: string) {
    if (!id) { return; }
    // this.fetchLockedFields(id);
  }

  // MARK: @helpers
  // public fetchLockedFields = (id: string) => this.lockedFieldsApi.set({
  //   url: FBEndpoint.LockedFields,
  //   urlValues: { id },
  //   method: "get",
  // });

  // public lockFields = (
  //   body: FBLockedFieldBody,
  //   callback?: (data?: FBLockData, error?: any) => any
  // ) => this.lockFieldsApi.set({
  //   url: FBEndpoint.LockFields,
  //   urlValues: { id: body.documentRevisionId },
  //   method: "post",
  //   body,
  // }, (data, error) => {
  //   if (data) {
  //     this.lockFieldsApi.setData(data);
  //   }
  //   callback?.(data, error);
  // });

  // public expireLockedFields = (id?: string) => {
  //   if (!id) { return; }
  //   this.lockFieldsExpireApi.set({
  //     url: FBEndpoint.LockFieldsExpire,
  //     urlValues: { id },
  //     method: "post",
  //   });
  // };
}

export default FBLockState;
