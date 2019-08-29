import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import useDialog, { Dialog } from "./useDialog";

describe("useDialog hook tests", () => {
  let dialog: Dialog;

  const TestComponent: React.FunctionComponent = () => {
    dialog = useDialog();
    return <div>TEST</div>;
  };

  act(() => {
    mount(<TestComponent />);
  });

  it("has initial state", () => {
    expect(dialog.isOpen).toBe(false);
  });

  it("opens dialog", () => {
    act(() => {
      dialog.open();
    });

    expect(dialog.isOpen).toBe(true);
  });

  it("closes dialog", () => {
    act(() => {
      dialog.open();
      dialog.close();
    });

    expect(dialog.isOpen).toBe(false);
  });
});
