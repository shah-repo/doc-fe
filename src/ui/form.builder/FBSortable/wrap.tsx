import { arrayMove } from '@dnd-kit/sortable';
import { findIndex } from 'lodash';
import { useObserver } from 'mobx-react';
import React, { useMemo } from 'react';
import { FB } from '..';
import SM from '../../../App/Shifamed/Utils/SM/SM';
import { FBSortableProps } from './types';

export const withFBSortable = <T extends FBSortableProps>(
  Component: React.FC<T>,
): React.FC<T> => {
  const Comp = ({
    ...props
  }: T) => {
    const { workspaceState } = FB.useStores();
    const { _tabsState } = SM.useStores();

    const schema = useObserver(() => workspaceState?.schema ?? []);

    const items = useMemo(
      () => schema.filter((item) => {
        const isItemBelongsToCurrentTab = !item.tabId || _tabsState?.activeTabId === item.tabId;
        const isItemVisible = !item.deleted && !item.hidden;
        return isItemBelongsToCurrentTab && isItemVisible;
      }),
      [schema, _tabsState?.activeTabId],
    );

    const updateWorkspaceSchema = (oldId: string, newId: string) => {
      const schema = workspaceState?.getSchema();
      if (!schema) {
        return;
      }
      const oldIndex = findIndex(schema, { name: oldId });
      const newIndex = findIndex(schema, { name: newId });
      workspaceState?.setSchema(arrayMove(schema, oldIndex, newIndex));
    };

    return Component({
      ...(props),
      items,
      updateWorkspaceSchema,
    });
  };

  return (props: T) => Comp(props);
};
