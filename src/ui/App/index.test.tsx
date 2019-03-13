import { mount } from "enzyme";
import React from "react";
import App from "./";

it("renders without crashing", () => {
  mount(<App />);
});
