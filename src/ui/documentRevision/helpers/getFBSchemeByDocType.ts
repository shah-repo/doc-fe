import { find, get, isEmpty, map, maxBy, some, union, unionBy } from "lodash";
import { documentTypeSelectors } from "../../../state/ducks/documentRevisions/documentType";
import { DocumentType, DocumentTypeByIdState, tabIdByInternalType, TabInfo } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, FBFormTemplateProps } from "../../../state/ducks/documentRevisions/types";
import { store as appStore } from "../../../state/store";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { FB, FBSchemaProps } from "../../form.builder";
import { checkIsDocumentDirectApproved, checkIsDocumentPO } from "./checkDocumentGroup";

/**
 * Checks if any of the given output types are records.
 *
 * @param outputTypes Array of output types that will be checked.
 */
const hasDirectApproval = (outputTypes: DocumentType[]) =>
  some(outputTypes, (type) => checkIsDocumentDirectApproved(type?.groupOptions));

const hasPO = (outputTypes: DocumentType[]) =>
  some(outputTypes, (type) => checkIsDocumentPO(type.groupOptions));

/**
   * @method
   *
   * This will generate new initial workspace scheme based on predefined schemes of
   * selected document type & output type. At the end we will merge config of each predefined
   * item in case the user has already updated some item config.
   * This is a temp hack to enable further creation of the FB form with all
   * associated actions (i.e delete item).
   *
   * @param {Record<string, any>} formik form values
   * @param {Record<string, DocumentType>} document types dict
   * @param {FBSchemaProps[]} active workspace scheme
   */
export const getFBSchemeByDocType = (
  formValue: Partial<DocumentRevision> & Partial<FBFormTemplateProps>,
  documentTypesById: DocumentTypeByIdState,
  originScheme?: FBSchemaProps[],
  tabId?: string,
): FBSchemaProps[] => {
  const outputTypes = map(formValue.outputDocumentTypes as OptionType[], "value");
  const outputTypesWithGroups = outputTypes?.map((docType) => documentTypesById[docType]);
  const tplType = get(formValue, "document.documentType.id") || "";
  const documentTypes = union([tplType], outputTypes);

  const finalScheme: FBSchemaProps[] = documentTypes.reduce((scheme, typeId) => {
    const rec = documentTypesById[typeId];
    // If type has scheme
    if (!rec?.schema) { return scheme; }
    const typeScheme = map(rec.schema, ((schemaItem) => ({
      ...schemaItem,
      ...find(originScheme, { name: schemaItem.name }),
      deleteDisabled: schemaItem.deleteInFormDisabled,
    })));

    return unionBy(scheme, typeScheme, "name");
  }, [] as FBSchemaProps[]);
  let indexLast;
  !isEmpty(finalScheme) ? indexLast = maxBy(finalScheme, "index")?.index : indexLast = 0;
  if (hasDirectApproval(outputTypesWithGroups)) {
    if (hasPO(outputTypesWithGroups)) {

      const tabConfig: TabInfo[] = documentTypeSelectors.getTabConfiguration(
        appStore.getState(), outputTypesWithGroups[0].group);
      const tabLabel = get(tabConfig, "0.tabId", "details");

      finalScheme.push({
        label: "form.builder.approvals",
        type: "poapprovals",
        deleteDisabled: false,
        name: `fb-po-approvals-${FB.uniqid}`,
        uniqueSchemaItem: true,
        tabId: tabLabel,
        index: indexLast + 1,
      });
    } else {
      finalScheme.push({
        label: "form.builder.approvals",
        type: "approvals",
        deleteDisabled: true,
        name: `fb-approvals-${FB.uniqid}`,
        uniqueSchemaItem: true,
        tabId: tabIdByInternalType[outputTypesWithGroups[0].group] || tabId,
        index: indexLast + 1,
      });
    }
  }
  return finalScheme;
};
