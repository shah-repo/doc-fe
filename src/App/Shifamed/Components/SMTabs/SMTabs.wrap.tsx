import { isEmpty } from 'lodash';
import { reaction } from 'mobx';
import React, { useCallback, useEffect } from 'react';
import { SM, SMTabsProps } from '../../..';
import { useFormContext } from '../../../../ui/components/forms/FormContext';

export const withSMTabsWrap = <T extends SMTabsProps>(Component: React.FC<T>) => {
  const Comp = (props: T) => {
    const { tabs, onChange } = props;
    const { _tabsState, _formState } = SM.useStores();
    const { isEditing } = useFormContext();

    // Set initial tab id.
    useEffect(
      () => {
        if (isEmpty(tabs) || _tabsState?.activeTabId) {
          return;
        }

        _tabsState?.setActiveTabId(tabs[0].tabId);
      },
      [_tabsState, tabs],
    );

    const handleChange: SMTabsProps['onChange'] = useCallback(
      (event, newValue) => {
        if (_formState?.isDirty && isEditing) {
          _tabsState?.setTabChangePrompt({ tabId: newValue, isOpen: true, event });
          return;
        }
        _tabsState?.setActiveTabId(newValue);
        return onChange?.(event, newValue);
      },
      [_tabsState, onChange, _formState?.isDirty, isEditing],
    );
    useEffect(() => reaction(
      () => _tabsState?.tabChangePrompt,
      (tabChangePrompt) => {
        if (!tabChangePrompt?.isOpen && tabChangePrompt?.tabId) {
          _tabsState?.setActiveTabId(tabChangePrompt?.tabId);
          if (tabChangePrompt?.event) { onChange?.(tabChangePrompt?.event, tabChangePrompt?.tabId); }
        }
      },
    ), [_formState, _tabsState, onChange]);

    return (
      <Component
        {...props}
        {...{ _tabsState }}
        onChange={handleChange}
      />
    );
  };

  Comp.displayName = 'withSMTabsWrap';

  return Comp;
};
