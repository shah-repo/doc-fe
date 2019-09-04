import { mount } from "enzyme";
import React from "react";
import AppContainer from "./App.container";

it("renders without crashing", () => {
  mount(<AppContainer />);
});
