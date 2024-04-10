import {Directive, DirectiveBinding} from 'vue';

const testId: Directive<HTMLElement> = {
  beforeMount(el, binding: DirectiveBinding) {
    if (binding.value) {
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'development') {
        el.setAttribute('data-test-id', binding.value as string);
      }
    }
  }
};

export default testId;
