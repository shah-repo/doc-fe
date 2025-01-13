import * as React from 'react';
import {
    NormalizedDragEvent,
    useDraggable,
    useDroppable,
} from '@progress/kendo-react-common';
import { GridRowProps } from '@progress/kendo-react-grid';
import { ReorderContext } from '..';

interface DraggableRowProps extends GridRowProps {
    elementProps: any
}

// DraggableRow component: Represents a row that can be dragged and dropped
export const DraggableRow = (props: DraggableRowProps) => {
    const [dropped, setDropped] = React.useState(false); // State to track if the row has been dropped
    const [dragged, setDragged] = React.useState(false); // State to track if the row is being dragged
    const [direction, setDirection] = React.useState<'before' | 'after' | null>(null); // State to track the direction of drop
    const [initial, setInitial] = React.useState({ x: 0, y: 0 }); // State to store initial mouse position
    const { dragStart, reorder } = React.useContext(ReorderContext); // Context for drag and reorder functions

    const element = React.useRef<HTMLTableRowElement>(null); // Reference to the DOM element

    // Handle initial press event to capture mouse position
    const handlePress = (event: NormalizedDragEvent) => {
        setInitial({
            x: event.clientX - event.offsetX,
            y: event.clientY - event.offsetY,
        });
    };

    // Handle drag start event
    const handleDragStart = (event: NormalizedDragEvent) => {
    // Check if the target element is a valid drag handle
        if (
            !event.originalEvent.target
            || !(event.originalEvent.target as HTMLElement).dataset.dragHandle
        ) {
            return;
        }
        setDragged(true); // Set dragged state to true
        dragStart(props.dataItem); // Trigger drag start in the context
    };

    // Handle dragging event
    const handleDrag = (event: NormalizedDragEvent) => {
        if (!element.current || !dragged) {
            return;
        }
        // Move the element according to the mouse position
        element.current.style.transform = `translateY(${
            event.clientY - initial.y + event.scrollY
        }px)`;
    };

    // Handle drag end event
    const handleDragEnd = () => {
        setDragged(false); // Reset dragged state
        setDropped(false); // Reset dropped state
        setInitial({ x: 0, y: 0 }); // Reset initial position
    };

    // Handle release event
    const handleRelease = () => {
        if (!element.current) {
            return;
        }
        element.current.style.transform = ''; // Reset transformation
    };

    // Handle when draggable element enters droppable area
    const handleDragEnter = () => {
        setDropped(true); // Set dropped state to true
        setDirection(null); // Reset direction state
    };

    // Handle dragging over droppable area
    const handleDragOver = (event: NormalizedDragEvent) => {
        if (!element.current) {
            return;
        }
        const rect = element.current.getBoundingClientRect(); // Get bounding box of the element
        // Determine direction based on cursor position
        setDirection(rect.top + rect.height / 2 <= event.pageY ? 'after' : 'before');
    };

    // Handle drag leave event
    const handleDragLeave = () => {
        setDropped(false); // Reset dropped state
        setDirection(null); // Reset direction state
    };

    // Handle drop event
    const handleDrop = () => {
        reorder(props.dataItem, direction); // Reorder items based on drop position
        setDropped(false); // Reset dropped state
        setDirection(null); // Reset direction state
    };

    // Register draggable functionality
    useDraggable(
        element,
        {
            onPress: handlePress,
            onDragStart: handleDragStart,
            onDrag: handleDrag,
            onDragEnd: handleDragEnd,
            onRelease: handleRelease,
        },
        { autoScroll: dragged },
    );

    // Register droppable functionality
    useDroppable(element, {
        onDragEnter: handleDragEnter,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
    });

    return (
    <React.Fragment>
      {dropped && direction === 'before' && (
        <tr
          style={{
            outlineStyle: 'solid',
            outlineWidth: 1,
            outlineColor: 'red',
          }}
        />
      )}
      <tr
        {...props.elementProps}
        ref={element}
        style={{
          backgroundColor: '#fff',
          userSelect: 'none',
          pointerEvents: dragged ? 'none' : undefined,
          opacity: dragged ? '0.8' : undefined,
        }}
      />
      {dropped && direction === 'after' && (
        <tr
          style={{
            outlineStyle: 'solid',
            outlineWidth: 1,
            outlineColor: 'red',
          }}
        />
      )}
    </React.Fragment>
    );
};
