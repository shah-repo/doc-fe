import { Step, StepButton } from "@material-ui/core";
import _ from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FBStepperProps } from ".";
import { FB, FBSwitchPanelState } from "..";
import Text from "../../components/Text";
import { FBStepperWidth } from "./FBStepper.types";

export const withFBStepper = <T extends FBStepperProps>(
  Component: React.FunctionComponent<T>,
) => {
  const Comp = ({
    state,
    steps,
    config = [],
    width = FBStepperWidth.default,
    activeStep = 0,
    beforeStepChange,
    ...props
  }: T) => {
    state = FB.useRef<FBSwitchPanelState>(FBSwitchPanelState);
    _.size(steps) <= 3 && (width = FBStepperWidth.middle);

    function getContent(step: number): React.ReactNode | string {
      const stepConfig = _.get(config, step);
      return stepConfig.content;
    }

    function stateConfig(step: number) {
      state?.setActive(step);
      state?.setContent(getContent(step));
    }

    React.useEffect(() => {
      stateConfig(activeStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStep = (step: number) => () => {
      beforeStepChange && beforeStepChange(step);
      stateConfig(step);
    };

    _.isUndefined(steps) &&
      (steps = _.map(config, (step, index) => (
        <Step key={`${step.title}-${index}`}>
          <StepButton onClick={handleStep(index)}>
            <Text message={step.title} />
          </StepButton>
        </Step>
      )));

    return useObserver(() =>
      Component({
        ...(props as T),
        activeStep: state?.active,
        content: state?.content,
        state,
        steps,
        width,
      }),
    );
  };

  return (props: T) => Comp(props);
};
