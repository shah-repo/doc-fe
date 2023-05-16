import { filter, includes, isEmpty, map, range, size } from 'lodash';
import { useObserver } from 'mobx-react';
import React from 'react';
import { FB, FBEditorState, FBFieldName, FBInputProps, FBSchemaComponentProps, FBSchemaProps, FBSchemaState, FBSortable, FBWorkspaceModeOptions } from '..';
import SM from '../../../App/Shifamed/Utils/SM/SM';
import { intl } from '../../../common/intl';
import { isTranslation } from '../../translations/types';
import FBFieldOutputWrapper from '../FBFieldOutputWrapper/FBFieldOutputWrapper';

export const withFBSchema = <T extends FBSchemaComponentProps>(
  Component: React.FunctionComponent<T>
) => {
  const Comp = ({
    workspaceMode,
    schemaState,
    schema,
    ...props
  }: T) => {

    !schemaState && (schemaState = FB.useRef<FBSchemaState>(FBSchemaState, schema));
    const { workspaceState, formState } = FB.useStores();
    const { isOutput, id, document: { outputRevision = false } = {} } = workspaceState || {};
    const { _tabsState, _documentRevisionFormState } = SM.useStores();

    function controlRenderer(schemaItem: FBSchemaProps | FBInputProps): React.ReactNode | undefined {
      return FBSchemaState.component({ ...schemaItem, gutter: false });
    }

    function isApproved(schemaItem: FBSchemaProps): boolean {
      const { index = 0 } = schemaItem;
      const { formState } = FB.useStores();
      let disabled = false;

      range(0, index).reverse().some((current) => {
        if (!schema) { return disabled; }
        const item =  schema[current];
        const { type, name } = item;
        if (type === 'requestapproval' || type === 'inlineapproval') {
          const activeConfig = type === 'inlineapproval' ? item : formState?.getFieldValue(name);
          const { approveIsBlocking = false } = activeConfig || {};
          let hasValue = type === 'inlineapproval'
            ? formState?.getFieldValue(name)
            : formState?.getFieldValue(FBFieldName.RequestApproval + name);
          hasValue = Boolean(hasValue);
          if (approveIsBlocking && !hasValue) {
            disabled = true;
          }
          return true;
        }
        return false;
      });
      return disabled;
    }

    function schemaRenderer(): React.ReactNode | React.ReactNode[] | undefined {
      const isDesignOrFormDesign = [
        FBWorkspaceModeOptions.DESIGN,
        FBWorkspaceModeOptions.FORMDESIGN,
      ].includes(workspaceMode as FBWorkspaceModeOptions);

      const isPreviewOrFormPreview = [
        FBWorkspaceModeOptions.PREVIEW,
        FBWorkspaceModeOptions.FORMPREVIEW,
      ].includes(workspaceMode as FBWorkspaceModeOptions);

      schema?.forEach(({ name, validationAttribute, label, placeholder }) => {
        let attr = validationAttribute || (label as string) || placeholder || name;
        if (attr && isTranslation(attr)) {
          attr = intl.formatMessage({ id: attr });
        }
        if (name && attr) {
          formState?.setValidationAttributeName(name, attr);
        }
      });

      if (isDesignOrFormDesign) {
        return <FBSortable />;
      }

      let position = 0;
      return map(schema, (schemaItem, index, ro) => {
        const isUnderWorkspace = workspaceState?.getSchemaItem(schemaItem.name);
        const { disabled, outputDisabled } = schemaItem || {};
        const reviseDisabled = schemaItem.editorProperties?.includes('reviseDisabled');
        if (schemaItem.deleted || schemaItem.hidden ||
        ((_tabsState && schemaItem.tabId && !_tabsState?.isTabActive(schemaItem.tabId)
        && !_documentRevisionFormState?.leftPanelOpen))
        ) { return; }

        position++;
        return (
          <FBFieldOutputWrapper position={position} inputProps={schemaItem}>
            {controlRenderer({
              autosave: isUnderWorkspace && workspaceState?.autosave,
              ...schemaItem,
              ...(includes(FBEditorState.pickStepIndex, schemaItem.type)) && {
                stepIndex: size(filter(ro.slice(0, index + 1), (step) =>
                  !step.deleted && includes(FBEditorState.pickStepIndex, step.type))),
              },
              disabled: (
                disabled ||
                isPreviewOrFormPreview ||
                isApproved({ ...schemaItem, index }) ||
                (reviseDisabled && outputRevision) ||
                (outputDisabled && isOutput && !isEmpty(id))
              ),
              index,
            })}
          </FBFieldOutputWrapper>
        );
      });
    }

    useObserver(() => {
      schema = schemaState?.schema;
    });

    return Component({
      ...(props as T),
      schemaState,
      workspaceMode,
      schema,
      children: schemaRenderer(),
    });
  };

  return (props: T) => Comp(props);
};
