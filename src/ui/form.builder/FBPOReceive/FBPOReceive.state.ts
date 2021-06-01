import { Dictionary, template } from "lodash";
import { action, computed } from "mobx";
import { useIntl } from "react-intl";
import { FBPurchaseOrderItem, FBSchemaProps } from "..";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { toastError } from "../../components/notifications";
import { FBEndpoint } from "../defaults/FBEndpoint";
import FBRequest from "../FBApi/FBApi.request";
import { FBEditorElementType } from "../types/editor";

class FBPOReceiveState extends FBRequest<DocumentRevision, any>  {
  public receivedItems: FBRequest<any, Dictionary<number>> = new FBRequest();

  public constructor(id: string) {
    super();
    this.setPOId(id);
  }

  @computed public get poDocumentId(): string | undefined {
    return this.data?.document.id;
  }

  @computed public get schema(): FBSchemaProps[] | undefined {
    return this.data?.formDocument?.formTemplate?.schema as FBSchemaProps[];
  }

  @computed public get docValues(): Dictionary<any>| undefined {
    return this.data?.formInput;
  }

  @computed public get items(): FBPurchaseOrderItem[] | undefined {
    if (!this.schema) {
      return;
    }
    const poFieldName = this.schema
      .find((schemaItem) => schemaItem.type as FBEditorElementType  === "purchaseorder")
      ?.name;

    if (!poFieldName) {
      // TODO: agree on alternative for notifications
      const intl = useIntl();
      toastError(intl.formatMessage({ id: "form.builder.receive.po.not.found" }));
      return;
    }

    return this.docValues?.[poFieldName]?.items || [];
  }

  @action public getSchema = (): FBSchemaProps[] | undefined =>
    this.schema;

  @action public setPOId = async (id?: string) => {
    if (!id) {
      return;
    }
    this.data = undefined;
    const urlTpl = template(FBEndpoint.FetchDocumentRevision);
    const url = urlTpl({ documentId: id });
    this.setUrl(url);
    await this.fetch();
  };
}

export default FBPOReceiveState;
