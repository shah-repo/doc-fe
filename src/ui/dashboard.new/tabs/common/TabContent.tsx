import React, { FC, ReactNode } from "react";
import { DashboardTabValues } from "../Tabs.types";

interface Props {
  tabsValue: DashboardTabValues;
  name: DashboardTabValues;
  children: ReactNode;
}

const TabContent: FC<Props> = ({ tabsValue, name, children }) => {
  if (tabsValue !== name) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`scrollable-auto-tabpanel-${name}`}
      aria-labelledby={`scrollable-auto-tab-${name}`}
    >
      {children}
    </div>
  );
};

export default TabContent;
