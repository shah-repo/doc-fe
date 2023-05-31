import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, UniqueIdentifier, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { findIndex } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FB } from '..';
import { SortableItem } from './components/SortableItem';
import { SortablePlaceholder } from './components/SortablePlaceholder';
import { FBSortableProps } from './types';
import { withFBSortable } from './wrap';

const FBSortable: React.FC<FBSortableProps> = ({
  items = [],
  updateWorkspaceSchema,
}) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier>();
  const [localItems, setLocalItems] = useState(items);
  const { workspaceState } = FB.useStores();
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(
    () => setLocalItems(items),
    [items],
  );

  function updateLocalSchema (oldId: string, newId: string) {
    const oldIndex = findIndex(localItems, { name: oldId });
    const newIndex = findIndex(localItems, { name: newId });
    setLocalItems((prev) => arrayMove(prev, oldIndex, newIndex));
  }

  function handleDragEnd (event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldId = String(active.id);
    const newId = String(over.id);
    updateLocalSchema(oldId, newId);
    setTimeout(() => {
      updateWorkspaceSchema?.(oldId, newId);
    }, 0);
  }

  function handleDragStart (event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  const isDesignMode = workspaceState?.isMode('design') ?? false;
  const isAutosaveEnabled = workspaceState?.autosave ?? false;
  const activeItem = localItems.find((item) => item.name === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
    >
      <SortableContext
        items={localItems.map((item) => ({ id: item.name ?? '' }))}
        strategy={verticalListSortingStrategy}
      >
        {localItems.map((item, position) => (
          <SortableItem
            key={item.name}
            item={item}
            isFirst={position === 0}
            isDesignMode={isDesignMode}
            isAutosaveEnabled={isAutosaveEnabled}
          />
        ))}
      </SortableContext>
      <DragOverlay>
        {activeItem && (
          <SortablePlaceholder
            isFirst
            item={activeItem}
            isDesignMode={isDesignMode}
            isAutosaveEnabled={isAutosaveEnabled}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default withFBSortable(FBSortable);
