import { Tab, Tabs } from "@material-ui/core";
import { Observer } from "mobx-react";
import React, { ReactNode } from "react";
import { SMBox, SMMap, SMTabPanel, SMTabsProps, SMText } from "../../..";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { withSMTabsWrap } from "./SMTabs.wrap";

const SMTabs: React.FunctionComponent<SMTabsProps> = ({
  onChange,
  _tabsState,
  tabs,
  children,
  boxProps,
  tabProps,
}) => (
  <Observer>
    {() => (
      <SMBox {...boxProps} id="SMBodyTmpl">
        <Tabs
          {...{ onChange }}
          value={_tabsState?.value}
          style={{
            zIndex: 1,
            backgroundColor: Colors.alabaster,
            height: "auto",
            width: "100%",
            fontSize: "12px",
            padding: 0,
            borderBottom: `1px solid ${Colors.chinese_silver}`,
            minHeight: 44,
            maxHeight: 44,
            position: "sticky",
            marginBottom: 10,
          }}
          TabIndicatorProps={{ style: { background: Colors.cerulean } }}
        >
          {tabs?.map((tab, index) => (
            <Tab
              style={{ width: "auto", minWidth: 40, padding: 0, marginRight: 30 }}
              key={`sm-tabpanel-${tab}-${index}`}
              label={<SMText label={tab} />}
            />
          ))}
        </Tabs>
        <SMMap<ReactNode> collection={children}>
          {(child: ReactNode, index) => (
            <SMTabPanel {...{ index }} key={`sm-tabpanel-${index}`}>
              {child}
            </SMTabPanel>
          )}
        </SMMap>
      </SMBox>
    )}
  </Observer>
);

export default withSMTabsWrap(SMTabs);
