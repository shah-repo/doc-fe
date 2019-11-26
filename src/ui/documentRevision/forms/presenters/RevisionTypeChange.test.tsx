import { shallow } from "enzyme";
import React from "react";
import { RevisionChangeType } from "../../../../state/ducks/documentRevisions";
import RadioButton from "../../../components/forms/fields/RadioButton";
import RadioGroupField from "../../../components/forms/fields/RadioGroup";
import { RevisionTypeChange } from "./RevisionTypeChange";

describe("Document revision form - RevisionTypeChange", () => {
  const getWrapper = () => shallow(
    <RevisionTypeChange />,
  );

  it("shows correct radio buttons", () => {
    const wrapper = getWrapper();
    const radioButton = wrapper.find(RadioGroupField).find(RadioButton);
    expect(radioButton.at(0).prop("value")).toEqual(RevisionChangeType.NextRevision);
    expect(radioButton.at(1).prop("value")).toEqual(RevisionChangeType.NextRevisionStage);
    expect(radioButton.at(2).prop("value")).toEqual(RevisionChangeType.Obsolete);
  });
});
