import { axios, api } from "./../../config";
import router from "./../../router/index";

const state = {
  authStatus: false,
  userProfile: null,
  doctorProfile: null,
};
const mutations = {
  SET_AUTH_STATUS(state, payload) {
    state.authStatus = payload;
  },
  SET_USER_PROFILE(state, payload) {
    state.userProfile = payload;
  },
  SET_DOCTOR_PROFILE(state, payload) {
    const neededFields = [
      "name",
      "email",
      "birthday",
      "phone",
      "medical_university",
      "years_of_education",
      "medical_specialty",
      "internship",
      "residency",
      "photo",
      "country",
    ];
    neededFields.sort((a, b) => (a < b ? -1 : 1));
    const resultObj = {};

    neededFields.map((field) => {
      resultObj[field] = payload[field];
    });
    state.doctorProfile = resultObj;
  },

  SET_DOCTOR_NAME(state, payload) {
    state.doctorProfile.name = payload;
  },
  SET_DOCTOR_BIRTHDAY(state, payload) {
    state.doctorProfile.birthday = payload;
  },
  SET_DOCTOR_COUNTRY(state, payload) {
    state.doctorProfile.country = payload;
  },
  SET_DOCTOR_EMAIL(state, payload) {
    state.doctorProfile.email = payload;
  },
  SET_DOCTOR_INTERNSHIP(state, payload) {
    state.doctorProfile.internship = payload;
  },
  SET_DOCTOR_MEDICAL_SPECIALTY(state, payload) {
    state.doctorProfile.medical_specialty = payload;
  },
  SET_DOCTOR_MEDICAL_UNIVERSITY(state, payload) {
    state.doctorProfile.medical_university = payload;
  },
  SET_DOCTOR_PHONE(state, payload) {
    state.doctorProfile.phone = payload;
  },
  SET_DOCTOR_PHOTO(state, payload) {
    state.doctorProfile.photo = payload;
  },
  SET_DOCTOR_RESIDENCY(state, payload) {
    state.doctorProfile.residency = payload;
  },
  SET_DOCTOR_YEARS_OF_EDUCATION(state, payload) {
    state.doctorProfile.years_of_education = payload;
  },
};

const actions = {
  signUp({ dispatch }, data) {
    return axios.post(api.doctorSignUp, data).then(async (res) => {
      await dispatch("login", {
        login: data.user.login,
        password: data.user.password,
      });
      dispatch("fetchUserProfile");
    });
  },
  login({ commit, dispatch }, { login, password }) {
    return axios.post(api.doctorLogin, { login, password }).then((res) => {
      if (res.data.status === "error") {
        alert("профиль не найден");
        return;
      }

      commit("SET_AUTH_STATUS", true);
      window.localStorage.setItem(
        "neomedy",
        JSON.stringify({
          login: res.data.data.profile.login,
          token: res.data.data.token,
        })
      );
      axios.defaults.headers.common.Authorization = res.data.data.token;
      dispatch("fetchUserProfile");
      router.push({ name: "Dashboard" });
    });
  },
  confirmLogin({ commit, dispatch }, login) {
    return axios
      .get(api.confirmLogin, { params: { login } })
      .then(async (res) => {
        if (!res.data.data) {
          alert("профиль не найден");
          return res.data.data;
        }
        dispatch("fetchUserProfile");
        commit("SET_AUTH_STATUS", true);
        return res.data.data;
      });
  },
  fetchUserProfile({ state, commit, dispatch }) {
    return axios
      .get(api.getUserProfile)
      .then((res) => {
        commit("SET_USER_PROFILE", res.data.profile);
        dispatch("fetchDoctorProfile");
      })
      .then(() => {
        dispatch("fetchLangItems", {
          lang: state.userProfile.lang,
          type: "common",
        });
        dispatch("fetchLangItems", {
          lang: state.userProfile.lang,
          type: "doctor",
        });
      });
  },
  fetchDoctorProfile({ commit }) {
    return axios.get(api.getDoctorProfile).then((res) => {
      commit("SET_DOCTOR_PROFILE", res.data.data);
    });
  },
  logout({ commit }) {
    commit("SET_AUTH_STATUS", false);
    commit("SET_USER_PROFILE", null);
    window.localStorage.clear();
    router.push({ name: "Login" });
    delete axios.defaults.headers.common.Authorization;
  },
  fetchLangItems({ dispatch }, { lang, type }) {
    return dispatch(
      "lang/fetchLangItems",
      {
        lang,
        type,
      },
      { root: true }
    );
  },
  updateDoctorProfile({ state }) {
    console.log("saving...");
    return axios
      .post(api.postDoctorProfile, state.doctorProfile)
      .then((res) => {
        console.log("saved");
      });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
