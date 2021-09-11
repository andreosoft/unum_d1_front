<<<<<<< HEAD
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import './registerServiceWorker'
=======
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Vuelidate from "vuelidate";
import VuePhoneNumberInput from "vue-phone-number-input";
import PortalVue from "portal-vue";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
>>>>>>> b2d6ca6e035590b6822f21e5baace623bf4ce5eb

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
