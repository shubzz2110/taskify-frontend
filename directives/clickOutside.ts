declare global {
  interface HTMLElement {
    __clickOutSideHandler__?: (event: MouseEvent) => void;
  }
}

export default {
  mounted(el: HTMLElement, binding: any) {
    el.__clickOutSideHandler__ = (event: MouseEvent) => {
      if(!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.__clickOutSideHandler__);
  },
  unmounted(el: HTMLElement) {
    if (el.__clickOutSideHandler__) {
      document.removeEventListener("click", el.__clickOutSideHandler__);
    }
  }
}