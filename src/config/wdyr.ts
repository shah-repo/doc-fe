import React from "react";
import Config from "./";

if (!Config.isProduction && !Config.isSandbox && !Config.isDemo ) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
