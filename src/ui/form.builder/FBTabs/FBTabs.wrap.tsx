import { Tab } from "@material-ui/core";
import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBSwitchPanelState, FBTabsProps } from "..";
import Text from "../../components/Text";

export const withFBTabs = <T extends FBTabsProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    state,
    tabs,
    config = [],
    activeTab = 0,
    ...props
  }: T) => {

    state = FB.useRef<FBSwitchPanelState>(FBSwitchPanelState);

    function getContent(step: number): React.ReactNode | string {
      const stepConfig = _.get(config, step);
      return stepConfig.content;
    }

    function stateConfig(step: number) {
      state?.setActive(step);
      state?.setContent(getContent(step));
    }

    React.useEffect(() => {
      stateConfig(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = (event: React.ChangeEvent<{}>, newValue: number) =>
      stateConfig(newValue);

    _.isUndefined(tabs) && (tabs = _.map(config, (tab, index) => (
      <Tab
        key={`${tab.title}-${index}`}
        label={<Text message={tab.title} />}
      />
    )));

    return useObserver(() => Component({
      ...(props as T),
      value: state?.active,
      content: state?.content,
      onChange,
      state,
      tabs,
    }),
    );
  };

  return (props: T) => Comp(props);
};
