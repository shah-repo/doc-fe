import { Tab, Tabs } from "@material-ui/core";
import { Observer } from "mobx-react";
import React, { ReactNode } from "react";
import { SM, SMBox, SMMap, SMTabPanel, SMTabsProps, SMText } from "../../..";
import useStyles from "./SMTabs.styles";
import { withSMTabsWrap } from "./SMTabs.wrap";
import cx from "classnames";

const SMTabs: React.FunctionComponent<SMTabsProps> = ({
  onChange,
  _tabsState,
  tabs,
  children,
  boxProps,
  panelProps,
}) => {
  const classes = useStyles();
  const  { _documentRevisionFormState } = SM.useStores();

  return (
    <Observer>
      {() => (
        <SMBox
          id="SMBodyTmpl"
          {...boxProps}
          className={cx(classes.root, { [classes.tabheader]: !_documentRevisionFormState?.expanded })}
        >
          <Tabs
            className={cx(classes.tabs, { [classes.tabheader]: !_documentRevisionFormState?.expanded })}
            value={_tabsState?.activeTabId}
            onChange={onChange}
            TabIndicatorProps={{ className: classes.indicator }}
          >
            {tabs?.map(({ tabId, labelId }, index) => (
              <Tab
                key={`sm-tabpanel-${tabId}-${index}`}
                className={classes.tab}
                value={tabId}
                data-cy={`tabCon-${labelId}`}
                label={
                  <SMText label={labelId} />
                }
              />
            ))}
          </Tabs>
          <SMMap<ReactNode> collection={children}>
            {(child: ReactNode, index) => (
              <SMTabPanel
                key={`sm-tabpanel-${index}`}
                tabId={tabs?.[index]?.tabId}
                tabIndex={index}
                panelProps={panelProps}
              >
                {child}
              </SMTabPanel>
            )}
          </SMMap>
        </SMBox>
      )}
    </Observer>
  );
};

export default withSMTabsWrap(SMTabs);
