

export const channelErrorLogger = channel =>
    errorStats => console.log(`${channel} error: ${JSON.stringify(errorStats, null, 2)}`);

export const waitForTrue = (func: () => boolean, timeout: number) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      if (func()) {
        clearInterval(intervalId);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(intervalId);
        reject('timeout');
      }
    }, 100);
  });
};
