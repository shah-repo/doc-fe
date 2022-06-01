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
  tabWidth,
  children,
  boxProps,
}) =>  (
  <Observer>
    {() => (
      <SMBox {...boxProps} id="SMBodyTmpl">
        <Tabs
          {...{ onChange }}
          value={_tabsState?.value}
          style={{
            position: "fixed",
            zIndex: 1,
            backgroundColor: Colors.alabaster,
            height: "48px",
            width: tabWidth ? tabWidth : `calc(100% - 570px)`,
            fontSize: "12px",
          }}
          TabIndicatorProps={{ style: { background: Colors.cerulean } }}
        >
          {tabs?.map((tab, index) => (
            <Tab
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
