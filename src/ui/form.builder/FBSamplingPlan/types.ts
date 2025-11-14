export enum SamplingPlanType {
  ALL = 'ALL',
  AQL = 'AQL',
}

type SamplingPlanAqlLevel = 0.015 | 0.025 | 0.040 | 0.065 | 0.10 | 0.15 | 0.25 | 0.40 | 0.65 | 1.0 | 1.5 | 2.5 | 4.0 | 6.5 | 10 | 15 | 25;

export interface SamplingPlanValue {
  type: SamplingPlanType
  aqlLevel?: SamplingPlanAqlLevel
}
