/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react';
import Config from "./";

if (!Config.isProduction && !Config.isSandbox && !Config.isDemo ) {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}