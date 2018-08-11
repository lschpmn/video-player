
export function getStatus() {
  const instance = cast.framework.CastContext.getInstance();
  console.log('Chromecast Instance');
  console.log(instance);

  return instance.getCurrentSession();
}

export async function start(url: string) {

}