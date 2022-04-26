export class SessionTimeoutService {

  public static getInstance(): SessionTimeoutService {
    if (!SessionTimeoutService.instance) {
      SessionTimeoutService.instance = new SessionTimeoutService();
    }

    return SessionTimeoutService.instance;
  }


  private static instance: SessionTimeoutService;
  // eslint-disable-next-line arrow-body-style
  private callbackFunction: () => void = () => { return; };
  private timer: any;
  private alertMinutes = 1000 * 60 * 43;

  private constructor() {
    this.runTimer();
  }

  private runTimer = () => {
    this.timer = setTimeout(() => {
      this.callbackFunction();
    }, this.alertMinutes);
  };

  public setTimeoutCallback(callback: () => void) {
    this.callbackFunction = callback;
  }

  public resetSessionTimer() {
    clearTimeout(this.timer);
    this.runTimer();
  }

  public stopSessionTimer() {
    clearTimeout(this.timer);
  }
}
