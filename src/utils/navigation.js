export const addNavigationAnimation = () => {
  window.navigation.addEventListener("navigate", (event) => {
    if (!checkViewTransitionIsAvailable()) return;

    const toUrl = new URL(event.destination.url);
    if (location.origin !== toUrl.origin) return;

    event.intercept({
      async handler() {
        const text = await fetchUrlText(toUrl.pathname);
        const html = new DOMParser().parseFromString(text, "text/html");

        document.startViewTransition(() => {
          document.body.innerHTML = html.body.innerHTML;
          document.documentElement.scrollTop = 0;
        });
      },
    });
  });
};

const fetchUrlText = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  return text;
};

const checkViewTransitionIsAvailable = () => {
  return Boolean(document.startViewTransition);
};
