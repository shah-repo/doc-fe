import { intl } from "../../../common/intl";
import { FB } from "../../form.builder";
import { ChangeOrderGridItem, FBDocumentRevisionsValue } from "./ItemsAndDetails.types";

export const generateDocTitleText = (docId: string, displayRevision: string, name: string) => (
  `${docId} # rev ${displayRevision} - ${name}`
);

export const storeDataToFormData = (changeOrderItemsList: ChangeOrderGridItem[]): FBDocumentRevisionsValue[] => (
  changeOrderItemsList.map((item: ChangeOrderGridItem) => (
    {
      justificationOfChange: item.justificationOfChange,
      descriptionOfChange: item.descriptionOfChange,
      id: item.id,
      proposedDocumentRevision: {
        id: item.docRevId,
      },
    }
  ))
);

export const newARDocRevToAdd = (docRevId: string) => (
  {
    descriptionOfChange: intl.formatMessage({ id: "common.numeric.release" }),
    id: FB.uniqid,
    justificationOfChange: intl.formatMessage({ id: "common.numeric.release" }),
    proposedDocumentRevision: { id: docRevId },
  }
);
