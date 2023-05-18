import { datadogRum, RumInitConfiguration } from '@datadog/browser-rum';
import Config from './index';

export function initializeDataDog() {
  const dataDogConf: RumInitConfiguration = {
    applicationId: Config.DatadogApplicationId,
    clientToken: Config.DatadogClientToken,
    service: 'doc-fe',
    sampleRate: Config.DatadogSampleRate,
    trackInteractions: true,
    useCrossSiteSessionCookie: true,
    allowedTracingOrigins: [Config.PublicUrl],
    trackSessionAcrossSubdomains: true,
  };
  datadogRum.init(dataDogConf);
}
