export interface IRemoteValidatorsHelper {
  getDocumentRevById: (id: string) => Promise<any>;
}
