import { Box, CircularProgress } from '@material-ui/core';
import { filter, includes, isEmpty, range, size } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import { FB, FBEditorState, FBFieldName, FBSchemaComponentProps, FBSchemaProps, FBSchemaState, FBSortable, FBWorkspaceModeOptions } from '..';
import SM from '../../../App/Shifamed/Utils/SM/SM';
import { intl } from '../../../common/intl';
import { formFieldsDisabledChangeControl, suppliersDisabledChangeControl } from '../../document.revision/utils/helpers';
import { isTranslation } from '../../translations/types';
import FBFieldOutputWrapper from '../FBFieldOutputWrapper/FBFieldOutputWrapper';
const loaderRenderer = () => (
  <Box display="flex" justifyContent="center">
    <CircularProgress size={40} disableShrink />
  </Box>
);

const RowComponent = ({ index, style, data }) => {
  const { workspaceState } = FB.useStores();
  const { isOutput, id, document: { outputRevision = false } = {} } = workspaceState || {};
  const isBuildTypeChangeApprovalEnabled = useObserver(() => workspaceState?.buildTypeChangeStatus());
  const { schema, isApproved, isPreviewOrFormPreview } = data;
  const rowRef = useRef<HTMLDivElement>(null);

  const schemaItem = schema[index];
  if (!schemaItem) return null;

  const position = index + 1;

  const isUnderWorkspace = workspaceState?.getSchemaItem(schemaItem.name);
  const { disabled, outputDisabled } = schemaItem || {};
  const reviseDisabled = schemaItem.editorProperties?.includes('reviseDisabled');

  const disabledViaConfigOptions = schemaItem.name === 'part-vendors'
    ? suppliersDisabledChangeControl(workspaceState?.document) : formFieldsDisabledChangeControl(workspaceState?.document);

  useEffect(() => {
    if (rowRef.current) {
      const height = rowRef.current.getBoundingClientRect().height;
      const style = window.getComputedStyle(rowRef?.current?.firstChild as Element);
      const marginTop = parseFloat(style.marginTop);
      data.setSize(index, height + marginTop);
    }
  }, []);

  return (
    <div style={style}>
      <div ref={rowRef}>
        <FBFieldOutputWrapper position={position} inputProps={schemaItem} key={schemaItem.name}>
          {FBSchemaState.component({
            autosave: isUnderWorkspace && workspaceState?.autosave,
            ...schemaItem,
            ...(includes(FBEditorState.pickStepIndex, schemaItem.type)) && {
              stepIndex: size(filter(schema.slice(0, index + 1), (step) =>
                !step.deleted && includes(FBEditorState.pickStepIndex, step.type))),
            },
            disabled: (
              disabled
                || disabledViaConfigOptions
                || isPreviewOrFormPreview
                || isApproved({ ...schemaItem, index })
                || (reviseDisabled && outputRevision)
                || (outputDisabled && isOutput && !isEmpty(id))
                || isBuildTypeChangeApprovalEnabled
            ),
            gutter: false,
            index,
          })}
        </FBFieldOutputWrapper>
      </div>
    </div>
  );
};

const Row = React.memo(RowComponent);

export const withFBSchema = <T extends FBSchemaComponentProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    workspaceMode,
    schemaState,
    schema,
    ...props
  }: T) => {
    !schemaState && (schemaState = FB.useRef<FBSchemaState>(FBSchemaState, schema));
    const { workspaceState, formState } = FB.useStores();
    const { _tabsState, _documentRevisionFormState } = SM.useStores();

    // To avoid UI-freezes on rendering huge list in schema.
    const [rendered, setRendered] = useState(false);
    useEffect(() => {
      setTimeout(() => setRendered(true));
    }, []);

    const listRef = useRef<any>(null);
    const sizeMap = useRef<{ [key: number]: number }>({});

    function isApproved (schemaItem: FBSchemaProps): boolean {
      const { index = 0 } = schemaItem;
      let disabled = false;

      range(0, index).reverse().some((current) => {
        if (!schema) { return disabled; }
        const item = schema[current];
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

    function schemaRenderer (): React.ReactNode | React.ReactNode[] | undefined {
      const isDesignOrFormDesign = [
        FBWorkspaceModeOptions.DESIGN,
        FBWorkspaceModeOptions.FORMDESIGN,
      ].includes(workspaceMode as FBWorkspaceModeOptions) && !workspaceState?.document?.isBeingEditedAfterRelease;

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

      const getItemSize = (index: number) => {
        return sizeMap.current[index] || 80;
      };

      const setSize = (index: number, size: number) => {
        if (sizeMap.current[index] !== size) {
          sizeMap.current[index] = size;
          listRef.current?.resetAfterIndex(index);
        }
      };

      const visibleSchema = schema?.filter(schemaItem => {
        if (schemaItem.deleted || schemaItem.hidden
          || ((_tabsState && schemaItem.tabId && !_tabsState?.isTabActive(schemaItem.tabId)
            && !_documentRevisionFormState?.leftPanelOpen))
        ) { return false; }
        return true;
      });

      return (
        <List
          ref={listRef}
          height={530}
          itemCount={visibleSchema?.length}
          itemSize={getItemSize}
          width="100%"
          itemData={{
            schema: visibleSchema,
            setSize,
            isApproved,
            isPreviewOrFormPreview,
          }}
        >
          {Row}
        </List>
      );
    }

    useObserver(() => {
      schema = schemaState?.schema;
    });

    return Component({
      ...(props as T),
      schemaState,
      workspaceMode,
      schema,
      children: rendered ? schemaRenderer() : loaderRenderer(),
    });
  };

  return (props: T) => Comp(props);
};
