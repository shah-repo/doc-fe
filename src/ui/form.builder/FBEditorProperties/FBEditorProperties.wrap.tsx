import { at, some } from "lodash";
import React from "react";
import { FB, FBData, FBEditorPropertiesProps } from "..";
import { checkIsDocumentForm, checkIsDocumentPart } from "../../documentRevision/helpers/checkDocumentGroup";

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

    const docTypeId = workspaceState?.document?.document.documentType.id;
    const outputDocumentTypes = workspaceState?.document?.outputDocumentTypes.map((type) =>
    workspaceState?.externalState?.documentType?.byId[type.value]);
    const isOutputPart = some(outputDocumentTypes, (type) => checkIsDocumentPart(type.groupOptions));
    if (docTypeId) {
      const groupOptions = workspaceState?.externalState?.documentType?.byId[docTypeId].groupOptions;
      const isDocumentForm = checkIsDocumentForm(groupOptions);
      const isDocumentPart = checkIsDocumentPart(groupOptions);
      if ((isDocumentForm && isOutputPart) || isDocumentPart) {
        console.log("yes");
      }
    }

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
