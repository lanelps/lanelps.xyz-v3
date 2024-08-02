const createPage = () => {
  let hasLoaded = $state(false);

  return {
    get hasLoaded() {
      return hasLoaded;
    },
    set: (value: boolean) => (hasLoaded = value),
  };
};

export const page = createPage();
