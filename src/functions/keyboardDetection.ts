export const hasPhysicalKeyboard = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine) and (hover: hover)').matches;
};
