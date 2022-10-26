import Vue from "vue";
import { createPinia, PiniaVuePlugin } from "pinia";
import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);
Vue.use(PiniaVuePlugin);

const pinia = createPinia();
export { pinia };
