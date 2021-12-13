/** @format */

import Vue from 'vue';
import ru from './translations/ru';

let translations = {};
Object.assign(translations, ru);

Vue.prototype.$t = function(s, lang) {
  if (!lang) lang = 'ru'; //this.$root.lang;
  s = s.toLowerCase();
  if (this.$root.config && this.$root.config.translations && this.$root.config.translations[s]) {
    return this.$root.config.translations[s];
  } else if (translations[lang] && translations[lang][s]) {
    return translations[lang][s];
  } else if (this.$root.getDoctorTranslation) {
    return this.$root.getDoctorTranslation(s);
  } else return s;
};

Vue.prototype.$log = function(info) {
  console.log(info);
};
