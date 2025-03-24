// import { Datacenter, datadogRum } from "@datadog/browser-rum";
import React from 'react';
import ReactDOM from 'react-dom';
import Config from './config';
import { initializeDataDog } from './config/datadog';
import * as serviceWorker from './serviceWorker';
import AppContainer from './ui/app/App.container';
import * as Sentry from '@sentry/react';
import { version } from '../package.json';

if (Config.DatadogEnabled) {
  initializeDataDog();
}

// ref: https://docs.sentry.io/platforms/javascript/guides/react/configuration/
Sentry.init({
  dsn: Config.sentryDSN,
  debug: process.env.REACT_APP_ENV_NAME !== 'PRODUCTION',
  release: `doc-fe@${version}`,
  environment: Config.EnvironmentName,
  integrations: [
    Sentry.browserProfilingIntegration(),
    Sentry.browserSessionIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.captureConsoleIntegration(),
    Sentry.contextLinesIntegration(),
    Sentry.dedupeIntegration(),
    Sentry.extraErrorDataIntegration(),
    Sentry.functionToStringIntegration(),
    Sentry.globalHandlersIntegration({ onerror: true, onunhandledrejection: true }),
    Sentry.httpClientIntegration(),
    Sentry.httpContextIntegration(),
    Sentry.moduleMetadataIntegration(),
    Sentry.replayIntegration({
      // Additional SDK configuration goes in here, for example:
      maskAllText: process.env.REACT_APP_ENV_NAME === 'PRODUCTION',
      blockAllMedia: process.env.REACT_APP_ENV_NAME === 'PRODUCTION',
    }),
    Sentry.replayCanvasIntegration({
      // Enabling the following will ensure your canvas elements are not forced
      // into `preserveDrawingBuffer`.
      enableManualSnapshot: true,
    }),
    Sentry.captureConsoleIntegration(),
    Sentry.extraErrorDataIntegration(),
  ],
  sampleRate: 0.25,
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^[:/\w\\.]*enlil\.io[:/\w\\.-]*$/, /^[:/\w\\.]*enlil\.io$/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.render(<AppContainer />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
