// eslint-disable-next-line spaced-comment
/// <reference types="@welldone-software/why-did-you-render" />

import React from "react";
import Config from "./";

if (!Config.isProduction && !Config.isSandbox && !Config.isDemo ) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    // To track all components in the project set trackAllPureComponents to true
    // To track individual component add componentName.whyDidYouRender=true; in
    // the component file
    trackAllPureComponents: false,
    logOnDifferentValues: true,
    trackExtraHooks: [[require("react-redux/lib"), "useSelector"]],
  });
}
