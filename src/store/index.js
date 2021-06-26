import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import patients from './modules/patients'
import doctors from './modules/doctors'
import lang from './modules/lang'
import events from './modules/events'
import debounce from 'lodash/debounce'


const updateDoctorProfileOn = [
  "SET_DOCTOR_NAME",
  "SET_DOCTOR_BIRTHDAY",
  "SET_DOCTOR_COUNTRY",
  "SET_DOCTOR_EMAIL",
  "SET_DOCTOR_INTERNSHIP",
  "SET_DOCTOR_MEDICAL_SPECIALTY",
  "SET_DOCTOR_MEDICAL_UNIVERSITY",
  "SET_DOCTOR_PHONE",
  "SET_DOCTOR_PHOTO",
  "SET_DOCTOR_RESIDENCY",
  "SET_DOCTOR_YEARS_OF_EDUCATION",
];


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    patients,
    doctors,
    lang,
    events
  }
})

const autosaveProgram = debounce(
  () => store.dispatch('auth/updateDoctorProfile'),
  1000,
  { maxWait: 4000 }
)

store.subscribe((mutation) => {
  if (updateDoctorProfileOn.indexOf(mutation.type.split('/')[1]) > -1) {
    autosaveProgram()
  }
});

export default store
