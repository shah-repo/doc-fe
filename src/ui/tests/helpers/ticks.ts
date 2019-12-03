const ticks = (callbacks: any = []) => {
  if (callbacks.length < 1) {
    return null;
  }
  setTimeout(() => {
    const cb: any = callbacks.shift();
    if (cb) {
      cb();
    }
    ticks(callbacks);
  });
};

export default ticks;
