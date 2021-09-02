import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Vuelidate from "vuelidate";
import VuePhoneNumberInput from "vue-phone-number-input";
import PortalVue from "portal-vue";
import "vue-phone-number-input/dist/vue-phone-number-input.css";

Vue.use(PortalVue);
Vue.use(Vuelidate);
Vue.config.productionTip = false;
Vue.component("vue-phone-number-input", VuePhoneNumberInput);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
