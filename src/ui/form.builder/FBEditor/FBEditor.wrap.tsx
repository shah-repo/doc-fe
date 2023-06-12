import { get } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FB, FBEditorProps, FBEditorState } from '..';
import { SM } from '../../../App';
import { documentTypeSelectors } from '../../../state/ducks/documentRevisions/documentType';
import { DocumentGroupType, DOC_TYPE_GROUP, TabInfo } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../state/reducers';
import { DocTypeGroups } from '../../dashboard.new/line.items/common/types';

export const withFBEditor = <T extends FBEditorProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    editorState,
    isFormOutput,
    mode,
    tabConfig,
    ...props
  }: T) => {
    const { workspaceState } = FB.useStores();
    const { _tabsState } = SM.useStores();

    const [activeTabLabelId, setActiveTabLabelId] = useState(_tabsState?.activeTabId);

    useEffect(() => {
      if (_tabsState) {
        editorState?.setTabId(_tabsState?.activeTabId);
      }
    }, [_tabsState]);

    editorState = editorState || FB.useRef<FBEditorState>(FBEditorState);
    isFormOutput = workspaceState?.mode === 'formDesign';

    if (workspaceState?.document?.id) {
      const documentRevision
    = workspaceState?.externalState?.documentRevisions?.byId[workspaceState?.document?.id] as DocumentRevision;
      const docTypeGroup = get(documentRevision?.document.documentType, 'group', DOC_TYPE_GROUP.OTHER);
      const outputTypeGroup = get(documentRevision.formTemplate?.outputDocumentTypes[0], 'group');
      const group: DocumentGroupType = docTypeGroup === DocTypeGroups.FORM ? outputTypeGroup : docTypeGroup;
      tabConfig = useSelector((state: ApplicationState) => documentTypeSelectors.getTabConfiguration(state, group));
    }

    useEffect(() => {
      if (tabConfig) {
        const selectedTab = tabConfig.filter(val => val.tabId === activeTabLabelId)[0];
        setActiveTabLabelId(selectedTab?.labelId);
      }
    }, [tabConfig]);

    const handleTabSelection = (event: React.FormEvent<HTMLSelectElement>, value: TabInfo) => {
      setActiveTabLabelId(value?.labelId ?? value?.tabId);
      editorState?.setTabId(value?.tabId);
    };

    useObserver(() => {
      mode = editorState?.mode;
    });

    return Component({
      ...(props as T),
      editorState,
      isFormOutput,
      mode,
      tabConfig,
      handleTabSelection,
      activeTabLabelId,
    });
  };

  return (props: T) => Comp(props);
};
