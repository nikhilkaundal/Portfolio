declare module 'lenis' {
  interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    smooth?: boolean;
    smoothTouch?: boolean;
  }
  class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    destroy(): void;
    scrollTo(target: HTMLElement | string, options?: { offset?: number }): void;
    on(event: string, callback: Function): void;
  }
  export default Lenis;
}
