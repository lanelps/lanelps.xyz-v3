const createProject = () => {
  let isActive = $state(false);

  return {
    get isActive() {
      return isActive;
    },
    toggle: () => (isActive = !isActive),
    open: () => (isActive = true),
    close: () => (isActive = false),
  };
};

export const project = createProject();
