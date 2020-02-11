import { AssessmentType } from "../../../state/ducks/changeRequest";

export const REASONING_OPTIONS = {
  [AssessmentType.design]: [
    {
      key: "not_affect_changes",
      value: "cr.assessment.reasoning.design.not_affect_changes",
      text: "cr.assessment.reasoning.design.not_affect_changes",
    },
    {
      key: "equivalent_changes",
      value: "cr.assessment.reasoning.design.equivalent_changes",
      text: "cr.assessment.reasoning.design.equivalent_changes",
    },
  ],
  [AssessmentType.process]: [
    {
      key: "equivalent_changes",
      value: "cr.assessment.reasoning.process.equivalent_changes",
      text: "cr.assessment.reasoning.process.equivalent_changes",
    },
  ],
  [AssessmentType.regulatory]: [
    {
      key: "no_approvals",
      value: "cr.assessment.reasoning.regulatory.no_approvals",
      text: "cr.assessment.reasoning.regulatory.no_approvals",
    },
    {
      key: "no_submissions",
      value: "cr.assessment.reasoning.regulatory.no_submissions",
      text: "cr.assessment.reasoning.regulatory.no_submissions",
    },
    {
      key: "not_certified",
      value: "cr.assessment.reasoning.regulatory.not_certified",
      text: "cr.assessment.reasoning.regulatory.not_certified",
    },
  ],
};
