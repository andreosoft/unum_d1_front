import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import patients from "./modules/patients";
import doctors from "./modules/doctors";
import lang from "./modules/lang";
import events from "./modules/events";
import alerts from "./modules/alerts";
import debounce from "lodash/debounce";

const updateDoctorProfileOn = [
  "SET_DOCTOR_NAME",
  "SET_DOCTOR_BIRTHDAY",
  "SET_DOCTOR_COUNTRY",
  "SET_DOCTOR_EMAIL",
  "SET_DOCTOR_INTERNSHIP",
  "SET_DOCTOR_MEDICAL_SPECIALTY",
  "SET_DOCTOR_DOCTOR_SPECIALTY",
  "SET_DOCTOR_MEDICAL_UNIVERSITY",
  "SET_DOCTOR_PHONE",
  "SET_DOCTOR_PHOTO",
  "SET_DOCTOR_RESIDENCY",
  "SET_DOCTOR_YEARS_OF_EDUCATION",
  "SET_SERVICE_LANGUAGES",
  "SET_FELLOW_STUDENT",
  "SET_QUALIFICATION",
  "SET_FELLOW_STUDENT_NAME",
  "SET_FELLOW_STUDENT_SURNAME",
  "SET_FELLOW_STUDENT_SOCIAL_LINK",
  "SET_DOCTOR_TIME_INTERVAL",
];

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    patients,
    doctors,
    lang,
    events,
    alerts,
  },
});

const autosaveProgram = debounce(
  () => store.dispatch("auth/updateDoctorProfile"),
  1000,
  { maxWait: 4000 }
);

store.subscribe((mutation) => {
  if (updateDoctorProfileOn.indexOf(mutation.type.split("/")[1]) > -1) {
    autosaveProgram();
  }
});

export default store;
