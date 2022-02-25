/** @format */

import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import patients from './modules/patients';
import doctors from './modules/doctors';
import settings from './modules/settings';
import lang from './modules/lang';
import events from './modules/events';
import chats from './modules/chats';
import alerts from './modules/alerts';
import debounce from 'lodash/debounce';
import reminders from './modules/reminders';

const updateDoctorProfileOn = [
  'SET_DOCTOR_NAME',
  'SET_DOCTOR_BIRTHDAY',
  'SET_DOCTOR_COUNTRY',
  'SET_DOCTOR_EMAIL',
  'SET_DOCTOR_INTERNSHIP',
  'SET_DOCTOR_MEDICAL_SPECIALTY',
  'SET_DOCTOR_DOCTOR_SPECIALTY',
  'SET_DOCTOR_MEDICAL_UNIVERSITY',
  'SET_DOCTOR_PHONE',
  'SET_DOCTOR_PHOTO',
  'SET_DOCTOR_RESIDENCY',
  'SET_DOCTOR_YEARS_OF_EDUCATION',
  'SET_SERVICE_LANGUAGES',
  'SET_FELLOW_STUDENT',
  'SET_QUALIFICATION',
  'SET_FELLOW_STUDENT_NAME',
  'SET_FELLOW_STUDENT_SURNAME',
  'SET_FELLOW_STUDENT_SOCIAL_LINK',
  'SET_DOCTOR_TIME_INTERVAL',
];
const country = [
  'Австралия',
  'Азербайджан',
  'Албания',
  'Армения',
  'Афганистан',
  'Белоруссия',
  'Болгария',
  'Бразилия',
  'Великобритания',
  'Венгрия',
  'Германия',
  'Греция',
  'Грузия',
  'Дания',
  'Египет',
  'Индия',
  'Ирак',
  'Ирландия',
  'Исландия',
  'Испания',
  'Италия',
  'Казахстан',
  'Китай',
  'Кыргызстан',
  'Латвия',
  'Литва',
  'Малайзия',
  'Мексика',
  'Молдавия',
  'Непал',
  'Нидерланды',
  'Норвегия',
  'ОАЭ',
  'Пакистан',
  'Польша',
  'Португалия',
  'Россия',
  'Румыния',
  'Сербия',
  'Сингапур',
  'Сирия',
  'Словакия',
  'Словения',
  'США',
  'Таджикистан',
  'Турция',
  'Узбекистан',
  'Украина',
  'Филиппины',
  'Финляндия',
  'Франция',
  'Хорватия',
  'Черногория',
  'Чехия',
  'Швейцария',
  'Швеция',
  'Эстония',
  'Япония',
];
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    countries: country,

    user: {},
  },
  modules: {
    auth,
    patients,
    doctors,
    settings,
    lang,
    events,
    chats,
    alerts,
    reminders,
  },
});

const autosaveProgram = debounce(() => store.dispatch('auth/updateDoctorProfile'), 1000, { maxWait: 4000 });

store.subscribe((mutation) => {
  if (updateDoctorProfileOn.indexOf(mutation.type.split('/')[1]) > -1) {
    autosaveProgram();
  }
});

export default store;

/* export default new Vuex.Store({
  modules: {
    auth,
    patients,
    doctors,
    lang,
    events,
    chats,
    alerts,
  },
}); */
