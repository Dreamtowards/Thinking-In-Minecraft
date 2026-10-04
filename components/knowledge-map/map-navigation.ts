export function navigateMap(url: string) {
  if (`${window.location.pathname}${window.location.search}` !== url) {
    window.history.pushState(null, '', url);
  }
}
