import { at, filter, get, map, some } from "lodash";
import React from "react";
import { FB, FBData, FBEditorPropertiesOmitByGroup, FBEditorPropertiesProps, FBOption } from "..";
import { DocumentGroupOptionsType } from "../../../state/ducks/documentRevisions/documentType/types";
import { checkDocumentGroupOptions, checkIsDocumentForm } from "../../documentRevision/helpers/checkDocumentGroup";

export const withFBEditorProperties = <T extends FBEditorPropertiesProps>(
  Component: React.FunctionComponent<T>,
) => {

  const Comp = ({
    onChange,
    options,
    type,
    ...props
  }: T) => {

    const { formState, workspaceState } = FB.useStores();
    type && (options = FBData.editorPropertiesByType(type));

    const { document: docRev, externalState } = workspaceState || {};
    const docTypeId = docRev?.document.documentType.id;
    const documentTypesById = externalState?.documentType?.byId;
    const outputDocumentTypes = docRev?.outputDocumentTypes?.map((type) =>
      documentTypesById[type.value]);

    map(FBEditorPropertiesOmitByGroup, (v: string[], k: DocumentGroupOptionsType) => {
      if (!docTypeId) { return; }
      const docGroupOptions = documentTypesById[docTypeId].groupOptions;
      const isDocumentForm = checkIsDocumentForm(docGroupOptions);
      const isOutputInGroup = some(outputDocumentTypes, (type) =>
        checkDocumentGroupOptions(k, type.groupOptions));
      const isDocumentInGroup = checkDocumentGroupOptions(k, docGroupOptions);
      if (!(isDocumentForm && isOutputInGroup) && !isDocumentInGroup) {
        options = filter(options, (option) => !v.includes(get(option, "value"))) as FBOption[];
      }
    });

    onChange = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const [valueName, checked] = at(ev.target, ["value", "checked"]);
      // *NOTE: Mobile support until mobile switches to editor props
      formState?.setFieldValue(valueName, checked);
    };

    return Component({
      ...(props as T),
      onChange,
      options,
      type,
    });
  };
  return (props: T) => Comp(props);
};
