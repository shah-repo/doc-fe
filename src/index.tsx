import { Datacenter } from "@datadog/browser-core";
import { datadogRum } from "@datadog/browser-rum";
import React from "react";
import ReactDOM from "react-dom";
import { SM_APP_CONFIG } from "./common/constants";
import Config from "./config";
import * as serviceWorker from "./serviceWorker";
import AppContainer from "./ui/app/App.container";
import EnvStatusBarPresenter from "./ui/app/EnvStatusBar.presenter";

datadogRum.init({
  applicationId: SM_APP_CONFIG.DATADOG_APPLICATION_ID,
  clientToken: SM_APP_CONFIG.DATADOG_CLIENT_TOKEN,
  datacenter: Datacenter.EU,
  sampleRate: 100,
  trackInteractions: true,
});

ReactDOM.render(<EnvStatusBarPresenter isSandbox={Config.isSandbox} />, document.getElementById("env_banner"));
ReactDOM.render(<AppContainer />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
