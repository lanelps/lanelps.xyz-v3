const createPage = () => {
  let hasLoaded = $state(false);

  return {
    get hasLoaded() {
      return hasLoaded;
    },
    set: (value: boolean) => {
      hasLoaded = value;
      if (value) {
        document.body.classList.add("loaded");
      } else {
        document.body.classList.remove("loaded");
      }
    },
  };
};

export const page = createPage();
