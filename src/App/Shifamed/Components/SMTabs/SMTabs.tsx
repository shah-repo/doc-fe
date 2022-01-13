import { Box, Tab, Tabs } from "@material-ui/core";
import { Observer } from "mobx-react";
import React, { ReactNode } from "react";
import { SMMap, SMTabPanel, SMTabsProps, SMText } from "../../..";
import Colors from "../../../../ui/layout/theme/utils/colors";
import { withSMTabsWrap } from "./SMTabs.wrap";

const SMTabs: React.FunctionComponent<SMTabsProps> = ({
  onChange,
  _tabsState,
  tabs,
  children,
  boxProps,
}) =>  (
  <Observer>
    {() => (
      <Box {...boxProps}>
        <Tabs
          {...{ onChange }}
          value={_tabsState?.value}
          style={{
            position: "fixed",
            zIndex: 1001,
            backgroundColor: Colors.light_gray,
            width: "100%",
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={`sm-tabpanel-${tab}-${index}`}
              label={<SMText boxProps={{ fontFamily: "button" }} label={tab} />}
            />
          ))}
        </Tabs>
        <SMMap<ReactNode[]> collection={children}>
          {(child: ReactNode, index) => (
            <SMTabPanel {...{ index }} key={`sm-tabpanel-${index}`}>
              {child}
            </SMTabPanel>
          )}
        </SMMap>
      </Box>
    )}
  </Observer>
);

export default withSMTabsWrap(SMTabs);
