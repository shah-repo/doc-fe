import { find, get, map, some, union, unionBy } from "lodash";
import { DocumentType, DocumentTypeByIdState } from "../../../state/ducks/documentRevisions/documentType/types";
import { DocumentRevision, FBFormTemplateProps } from "../../../state/ducks/documentRevisions/types";
import { OptionType } from "../../components/forms/fields/Autocomplete/types";
import { FB, FBSchemaProps } from "../../form.builder";
import { checkIsDocumentDirectApproved, checkIsDocumentPO } from "./checkDocumentGroup";

/**
 * Checks if any of the given output types are records.
 *
 * @param outputTypes Array of output types that will be checked.
 */
const hasDirectApproval = (outputTypes: DocumentType[]) =>
  some(outputTypes, (type) => checkIsDocumentDirectApproved(type.groupOptions));

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
): FBSchemaProps[] => {

  const outputTypes = map(formValue.outputDocumentTypes as OptionType[], "value");
  const outputTypesWithGroups = outputTypes?.map((docType) => documentTypesById[docType]);
  const tplType = get(formValue, "document.documentType.id") || "";
  const documentTypes = union([tplType], outputTypes);

  const finalScheme = documentTypes.reduce((scheme, typeId) => {
    const rec = documentTypesById[typeId];
    // If type has scheme
    if (!rec.schema) { return scheme; }
    const typeScheme = map(rec.schema, ((schemaItem) => ({
      ...schemaItem,
      ...find(originScheme, { name: schemaItem.name }),
      deleteDisabled: schemaItem.deleteInFormDisabled,
    })));
    return unionBy(scheme, typeScheme, "name");
  }, [] as FBSchemaProps[]);

  if (hasDirectApproval(outputTypesWithGroups)) {
    if (hasPO(outputTypesWithGroups)) {
      finalScheme.push({
        label: "form.builder.approvals",
        type: "poapprovals",
        deleteDisabled: false,
        name: `fb-po-approvals-${FB.uniqid}`,
        uniqueSchemaItem: true,
      });
    } else {
      finalScheme.push({
        label: "form.builder.approvals",
        type: "approvals",
        deleteDisabled: true,
        name: `fb-approvals-${FB.uniqid}`,
        uniqueSchemaItem: true,
      });
    }
  }
  return finalScheme;
};
