import { mount } from "enzyme";
import React from "react";
import { Prompt, MemoryRouter } from "react-router-dom";
import PromptIfDirty, { Props } from "./PromptIfDirty";

describe("Prompt if Dirty component unit tests", () => {

  const defaultProps: Props = {
    dirty: true,
  }

  const getWrapper = (props: Props) => mount(
    <MemoryRouter >
      <PromptIfDirty {...defaultProps} {...props} />
    </MemoryRouter>
  );

  it("Displays correctly", () => {
    const wrapper = getWrapper({ dirty: true })
    expect(wrapper.find(Prompt)).toHaveLength(1);
  })

  it("Displays correct message", () => {
    const wrapper = getWrapper({ dirty: true })
    expect(wrapper.find(Prompt).prop('message')).toBe("Are you sure you want to leave? You have unsaved changes.");
  })

  it("Does not prompt if doNotPrompt prop is true", () => {
    const wrapper: any = getWrapper({ dirty: true, doNotPrompt: true })
    expect(wrapper.find(Prompt).prop('when')).toBe(false)
  });

  it("Does not prompt if dirty prop is false", () => {
    const wrapper: any = getWrapper({ dirty: false })
    expect(wrapper.find(Prompt).prop('when')).toBe(false)
  });
});
