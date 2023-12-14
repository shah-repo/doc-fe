interface LotQty {
  onHand: number
  used: number
}
export interface IRemoteValidatorsHelper {
  getDocumentRevById: (id: string) => Promise<any>
  getLotQtyById: (id: string) => Promise<LotQty>
}
