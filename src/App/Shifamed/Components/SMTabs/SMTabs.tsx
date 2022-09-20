import { Tab, Tabs } from "@material-ui/core";
import { Observer } from "mobx-react";
import React, { ReactNode } from "react";
import { SM, SMBox, SMMap, SMTabPanel, SMTabsProps, SMText } from "../../..";
import useStyles from "./SMTabs.styles";
import { withSMTabsWrap } from "./SMTabs.wrap";

const SMTabs: React.FunctionComponent<SMTabsProps> = ({
  onChange,
  _tabsState,
  tabs,
  children,
  boxProps,
  tabProps,
  panelProps,
}) => {
  const  { _documentRevisionFormState } = SM.useStores();
  const classes = useStyles();
  return (
    <Observer>
      {() => (
        <SMBox {...boxProps} id="SMBodyTmpl"  className={classes.root}
          style={{ overflow: !_documentRevisionFormState?.expanded ? "unset" : "scroll" }} >
          {_documentRevisionFormState?.expanded}
          <Tabs
            {...{ onChange }}
            value={_tabsState?.value}
            className={[classes.tabs, !_documentRevisionFormState?.expanded ? classes.mpi : ""].join(" ")}

            TabIndicatorProps={{ className: classes.indicator }}
          >
            {tabs?.map((tab, index) => (
              <Tab
                { ...{ tabProps }}
                className={classes.tab}

                key={`sm-tabpanel-${tab}-${index}`}
                data-cy={`tabCon-${tab}`}
                label={<SMText label={tab} />}
              />
            ))}
          </Tabs>
          <SMMap<ReactNode> collection={children}>
            {(child: ReactNode, index) => (
              <SMTabPanel {...{ index, panelProps }} key={`sm-tabpanel-${index}`}>
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
