import { Datacenter } from "@datadog/browser-core";
import { datadogRum } from "@datadog/browser-rum";
import React from "react";
import ReactDOM from "react-dom";
import Config from "./config";
import * as serviceWorker from "./serviceWorker";
import AppContainer from "./ui/app/App.container";
import EnvStatusBarPresenter from "./ui/app/EnvStatusBar.presenter";

datadogRum.init({
  applicationId: process.env.REACT_APP_DATADOG_APPLICATION_ID as string,
  clientToken: process.env.REACT_APP_DATADOG_CLIENT_TOKEN as string,
  datacenter: Datacenter.US,
  sampleRate: 100,
  trackInteractions: true,
});

ReactDOM.render(<EnvStatusBarPresenter isSandbox={Config.isSandbox} />, document.getElementById("env_banner"));
ReactDOM.render(<AppContainer />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
