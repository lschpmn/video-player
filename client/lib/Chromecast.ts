
export function getStatus() {
  const instance = cast.framework.CastContext.getInstance();
  console.log('Chromecast Instance');
  console.log(instance);

  return instance.getCurrentSession();
}

export function setupChromecast() {
  return new Promise((resolve, reject) => {
    try {
      const intervalId = setInterval(() => {
        if ((window as any)._IS_AVAILABLE !== true) return;

        cast.framework.CastContext.getInstance().setOptions({
          receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          // @ts-ignore
          autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
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

export async function start(url: string) {

}