export const addNavigationAnimation = () => {
  window.navigation.addEventListener("navigate", (event) => {
    if (!checkViewTransitionIsAvailable()) return;

    const toUrl = new URL(event.destination.url);
    if (location.origin !== toUrl.origin) return;

    event.intercept({
      async handler() {
        const text = await fetchUrlText(toUrl.pathname);
        const bodySearch = extractBodyFromHTML(text);
        if (!bodySearch) return;

        document.startViewTransition(() => {
          document.body.innerHTML = bodySearch[0];
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

const extractBodyFromHTML = (html) => {
  return html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
};

const checkViewTransitionIsAvailable = () => {
  return Boolean(document.startViewTransition);
};
