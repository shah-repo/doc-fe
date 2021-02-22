import { Step, StepButton } from "@material-ui/core";
import { get, isUndefined, map, size } from "lodash";
import { useObserver } from "mobx-react";
import React from "react";
import { FB, FBStepperProps, FBStepperWidth, FBSwitchPanelState } from "..";
import Text from "../../components/Text";

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
    size(steps) <= 3 && (width = FBStepperWidth.middle);

    function getContent(step: number): React.ReactNode | string {
      const stepConfig = get(config, step);
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

    isUndefined(steps) &&
      (steps = map(config, (step, index) => (
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
