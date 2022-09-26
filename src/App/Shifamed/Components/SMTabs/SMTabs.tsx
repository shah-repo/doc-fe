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
        <SMBox {...boxProps} id="SMBodyTmpl" className={cx(classes.root,
          { [classes.tabheader]: !_documentRevisionFormState?.expanded })}>
          <Tabs
            {...{ onChange }}
            value={_tabsState?.activeTabId}
            className={cx(classes.tabs, { [classes.tabheader]: !_documentRevisionFormState?.expanded })}
            TabIndicatorProps={{ className: classes.indicator }}
          >
            {tabs?.map((tab, index) => (
              <Tab
                key={`sm-tabpanel-${tab}-${index}`}
                className={classes.tab}
                value={tab}
                data-cy={`tabCon-${tab}`}
                label={<SMText label={tab} />}
              />
            ))}
          </Tabs>
          <SMMap<ReactNode> collection={children}>
            {(child: ReactNode, index) => (
              <SMTabPanel {...{ tabId: tabs?.[index], panelProps }} key={`sm-tabpanel-${index}`}>
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
