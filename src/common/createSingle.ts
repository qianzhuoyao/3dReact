export const createSingle = <T>(creator: () => T): (() => T | null) => {
  let instance: T | null = null;
  return () => {
    if (!instance) {
      instance = creator();
    }
    return instance;
  };
};
