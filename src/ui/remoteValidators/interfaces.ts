export const DATA_HELPER_CALLBACK_NAME = "DataHelperCallback";

export interface IRemoteValidatorsHelper {
  getDocumentRevById: (id: string) => Promise<any>;
}
