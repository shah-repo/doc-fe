export type CallbackHandlerFn<T> = (arg: T) => any;

class CallbackHandler<T = any> {
  constructor(
    private callback?: CallbackHandlerFn<T>,
  ) {
    this.callback = callback;
  }

  public execute(arg: T) {
    if (this.callback) {
      this.callback(arg);
    }
  }

  public connect(callback: CallbackHandlerFn<T>) {
    this.callback = callback;
  }

  public disconnect() {
    this.callback = undefined;
  }
}

export default CallbackHandler;
