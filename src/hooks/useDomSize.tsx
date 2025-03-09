import { useRef } from "react";
import { onDomResize } from "../event/onDomReszie";

export const useDomSize = () => {
  const ref = useRef<{
    containerDom: HTMLElement | null;
  }>({
    containerDom: null,
  });

  const resizeSubscribe = (
    dom: HTMLElement,
    resizeCallback?: (width: number, height: number) => void
  ) => {
    ref.current.containerDom = dom;
    const { resize$ } = onDomResize(ref.current.containerDom);
    return resize$.subscribe(() => {
      const rect = ref.current.containerDom?.getBoundingClientRect();
      if (rect) {
        const { width, height } = rect;
        resizeCallback?.(width, height);
      }
    });
  };

  return {
    resizeSubscribe,
  };
};
