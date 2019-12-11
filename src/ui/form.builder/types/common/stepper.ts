export interface FBStepperProps {
  steps: string[];
  activeStep?: number;
  handleStep?: (step: number) => any;
  getStepContent: (step: number) => any;
}
