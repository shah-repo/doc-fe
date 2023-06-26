import React, { Children, cloneElement, ComponentType, createContext, forwardRef, HTMLAttributes, RefAttributes, useContext, useEffect, useRef } from 'react';
import { ListChildComponentProps, VariableSizeList } from 'react-window';

const LISTBOX_PADDING = 8; // px
const OuterElementContext = createContext({});
const InnerElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});
OuterElementType.displayName = 'OuterElementType';

const InnerElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(InnerElementContext);
  return <ul {...props} {...outerProps} style={{ height: 'auto' }} />;
});
InnerElementType.displayName = 'InnerElementType';

const renderRow = (props: ListChildComponentProps) => {
  const { data, index, style } = props;
  const tooltipItem = {
    ...data[index],
    props: {
      ...data[index].props,
      children: data[index].props.children,
    },
  };
  const listItem = cloneElement(tooltipItem, {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
      whiteSpace: 'nowrap',
    },
  });
  return listItem;
};

const useResetCache = (data: any) => {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current === null) {
      return;
    }
    ref.current.resetAfterIndex(0, true);
  }, [data]);
  return ref;
};

// Adapter for react-window
const ListBoxComponent: React.ForwardRefExoticComponent<RefAttributes<HTMLDivElement>>
  = forwardRef<HTMLDivElement>(function ListBoxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = Children.toArray(children);
    const itemCount = itemData.length;
    const listRef = useResetCache(itemCount);
    const itemSize = () => 36;

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize();
      }
      return itemCount * itemSize();
    };

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={listRef}
            outerElementType={OuterElementType}
            innerElementType={InnerElementType}
            itemSize={itemSize}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  });

export default ListBoxComponent as ComponentType<HTMLAttributes<HTMLElement>>;
