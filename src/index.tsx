// import { Datacenter, datadogRum } from "@datadog/browser-rum";
import React from "react";
import ReactDOM from "react-dom";
import Config from "./config";
import { initializeDataDog } from "./config/datadog";
import * as serviceWorker from "./serviceWorker";
import AppContainer from "./ui/app/App.container";

if (Config.DatadogEnabled) {
  initializeDataDog();
}

ReactDOM.render(<AppContainer />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
