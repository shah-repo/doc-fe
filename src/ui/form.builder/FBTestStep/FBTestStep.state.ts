import { FB, FBSchemaProps } from "..";

export class FBTestStepState {
  public schema: FBSchemaProps[] = [
    {
      type: "paragraph",
      paragraph: "Type description here...",
      name: `fb-teststep-paragraph-${FB.uniqid()}`,
    },
    {
      type: "testRequirement",
      label: "Test Requirement",
      name: `fb-teststep-testRequirement-${FB.uniqid()}`,
    },
    {
      type: "instructionsmediaupload",
      label: "Instructions Media Upload",
      name: `fb-teststep-instructionsmediaupload-${FB.uniqid()}`,
      isTemplate: true,
    },
    {
      type: "evidencemediaupload",
      label: "Evidence Media Upload",
      name: `fb-teststep-evidencemediaupload-${FB.uniqid()}`,
    },
  ];
}

export default FBTestStepState;
