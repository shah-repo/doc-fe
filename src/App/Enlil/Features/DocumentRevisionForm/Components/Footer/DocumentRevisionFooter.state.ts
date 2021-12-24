import { action, computed, observable, set } from "mobx";
import { DocumentRevisionFooterInfo, DocumentRevisionFooterStateProps } from "../../../../..";

export default class DocumentRevisionFooterState implements DocumentRevisionFooterStateProps {

  // MARK: @config

  // MARK: @observables
  @observable public info?: DocumentRevisionFooterInfo;

  // MARK: @api

  // MARK: @constructor

  // MARK: @computed
  @computed public get version(): string | undefined {
    return this.info?.version;
  }

  @computed public get docId(): string | undefined {
    return this.info?.docId;
  }

  @computed public get releasedAt(): string | undefined {
    return this.info?.releasedAt;
  }

  // MARK: @actions
  @action public setInfo = (info?: DocumentRevisionFooterInfo) => {
    set(this, "info", info);
  };

  // MARK: @helpers
}
