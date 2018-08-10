
export function setupChromecast() {
  return new Promise((resolve, reject) => {
    try {
      const intervalId = setInterval(() => {
        if ((window as any)._IS_AVAILABLE !== true) return;

        cast.framework.CastContext.getInstance().setOptions({
          receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        });

        clearInterval(intervalId);
        resolve();
      }, 100);
    } catch (err) {
      console.log('Chromecast error');
      console.log(err);
      reject(err);
    }
  });
}