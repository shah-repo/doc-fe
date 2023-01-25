import { Tab, Tabs } from "@material-ui/core";
import { Observer } from "mobx-react";
import React, { ReactNode } from "react";
import { SMBox, SMMap, SMTabPanel, SMTabsProps, SMText } from "../../..";
import useStyles from "./SMTabs.styles";
import { withSMTabsWrap } from "./SMTabs.wrap";

const SMTabs: React.FunctionComponent<SMTabsProps> = ({
  onChange,
  _tabsState,
  tabs,
  children,
  boxProps,
  panelProps,
}) => {
  const classes = useStyles();

  return (
    <Observer>
      {() => (
        <SMBox
          id="SMBodyTmpl"
          className={classes.root}
          {...boxProps}
        >
          <Tabs
            className={classes.tabs}
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
