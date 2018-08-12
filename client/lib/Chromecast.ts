
export function getStatus() {
  const instance = cast.framework.CastContext.getInstance();
  console.log('Chromecast Instance');
  console.log(instance);

  return instance.getCurrentSession();
}

export async function start(url: string) {
  const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  const mediaInfo = new chrome.cast.media.MediaInfo(url, 'video/mp4');
  const request = new chrome.cast.media.LoadRequest(mediaInfo);

  try {
    await castSession.loadMedia(request);
  } catch (err) {
    console.log('Play error');
    console.log(err);
  }
}