import { shallow } from "enzyme";
import React from "react";
import { Async } from "../../hooks/useAsync";
import {
  DownloadButtonContainer,
  DownloadButtonContainerProps,
} from "./DownloadButton.container";
import DownloadButtonPresenter from "./DownloadButton.presenter";

describe("DownloadButtonContainer tests", () => {
  const attachmentId = "DASfjsak";
  const defaultProps: DownloadButtonContainerProps = {
    attachmentId,
    download: jest.fn(),
  };

  const getWrapper = (props: Partial<DownloadButtonContainerProps>) => shallow(
    <DownloadButtonContainer {...defaultProps} {...props} />,
  );

  const { open } = window;

  beforeAll(() => {
    Object.defineProperty(window, "open", { configurable: true });
    window.open = jest.fn();
  });

  afterAll(() => {
    window.open = open;
  });

  it("calls onClick and opens document on success", () => {
    const download = jest.fn();
    const wrapper = getWrapper({ download });
    const presenter = wrapper.find(DownloadButtonPresenter);

    (presenter.prop("onClick") as () => void)();

    expect(download).toHaveBeenCalledTimes(1);
    const parameters = download.mock.calls[0];

    expect(parameters[0]).toEqual(attachmentId);
    expect(parameters[1]).toBeDefined();

    (parameters[1] as Async).successHandler.execute("123");

    expect(window.open).toHaveBeenCalledWith("123", "_parent");
  });

  it("sets isLoading", () => {
    const wrapper = getWrapper({});
    const presenter = wrapper.find(DownloadButtonPresenter);

    expect(presenter.prop("isLoading")).toBe(false);
  });
});
