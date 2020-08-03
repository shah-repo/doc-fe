import { Datacenter, datadogRum } from "@datadog/browser-rum";
import Config from "./index";

export function initializeDataDog() {
  const dataDogConf = {
    applicationId: Config.DatadogApplicationId,
    clientToken: Config.DatadogClientToken,
    datacenter: Datacenter.US,
    sampleRate: 100,
    trackInteractions: true,
  };
  datadogRum.init(dataDogConf);

}
