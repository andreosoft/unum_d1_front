import * as plainAxios from "axios";
import { axios, api } from "./../../config";
import router from "./../../router/index";
import _ from "lodash";

const state = {
  authStatus: false,
  userProfile: null,
  doctorProfile: null,
  isProfileUpdating: false,
};
const mutations = {
  SET_AUTH_STATUS(state, payload) {
    state.authStatus = payload;
  },
  SET_USER_PROFILE(state, payload) {
    state.userProfile = payload;
  },
  SET_DOCTOR_PROFILE(state, payload) {
    try {
      const info = JSON.parse(payload.info);
      if (!payload.info) throw Error;
      payload.info = info;
    } catch (err) {
      payload.info = {};
      payload.info.serviceLanguages = [];
      payload.info.qualification = "";

      // first fellow student
      payload.info.fellowStudent1 = {};
      payload.info.fellowStudent1.name = "";
      payload.info.fellowStudent1.surname = "";
      payload.info.fellowStudent1.socialLink = "";

      // second fellow student
      payload.info.fellowStudent2 = {};
      payload.info.fellowStudent2.name = "";
      payload.info.fellowStudent2.surname = "";
      payload.info.fellowStudent2.socialLink = "";
      payload.info.doctor_specialty = "";
    }
    state.doctorProfile = payload;
  },
  SET_IS_PROFILE_UPDATING(state, value) {
    state.isProfileUpdating = value;
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
  SET_DOCTOR_DOCTOR_SPECIALTY(state, payload) {
    state.doctorProfile.info.doctor_specialty = payload;
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
  SET_SERVICE_LANGUAGES(state, payload) {
    state.doctorProfile.info.serviceLanguages = payload;
  },
  SET_FELLOW_STUDENT(state, payload) {
    if (payload.id === 1) {
      state.doctorProfile.info.fellowStudent1 = payload.value;
      return;
    }
    state.doctorProfile.info.fellowStudent2 = payload.value;
  },
  SET_FELLOW_STUDENT_NAME(state, payload) {
    if (payload.id === 1) {
      state.doctorProfile.info.fellowStudent1.name = payload.value;
      return;
    }
    state.doctorProfile.info.fellowStudent2.name = payload.value;
  },
  SET_FELLOW_STUDENT_SURNAME(state, payload) {
    if (payload.id === 1) {
      state.doctorProfile.info.fellowStudent1.surname = payload.value;
      return;
    }
    state.doctorProfile.info.fellowStudent2.surname = payload.value;
  },
  SET_FELLOW_STUDENT_SOCIAL_LINK(state, payload) {
    if (payload.id === 1) {
      state.doctorProfile.info.fellowStudent1.socialLink = payload.value;
      return;
    }
    state.doctorProfile.info.fellowStudent2.socialLink = payload.value;
  },
  SET_QUALIFICATION(state, payload) {
    state.doctorProfile.info.qualification = payload;
  },
  SET_DOCTOR_TIME_INTERVAL(state, payload) {
    state.doctorProfile.time_interval = payload;
  },
};

const actions = {
  signUp({ commit, dispatch, rootState }, data) {
    return dispatch("confirmLogin", data.user.login).then((status) => {
      if (!status) {
        return axios.post(api.doctorSignUp, data).then((res) => {
          dispatch("login", {
            login: data.user.login,
            password: data.user.password,
          }).then(async () => {
            await dispatch("fetchDoctorProfile");
            /**
             * The data that's being commited below doesn't come from the API
             * That's why I'm calling commits right after registration
             * These commits trigger updateProfile method which saves new data on server by POST method
             */
            commit("SET_DOCTOR_PHONE", data.user.phone);
            commit("SET_DOCTOR_COUNTRY", data.user.country);
            commit("SET_DOCTOR_BIRTHDAY", data.doctor.dateOfBirth);
            commit(
              "SET_DOCTOR_MEDICAL_UNIVERSITY",
              data.education.medical_university
            );
            commit(
              "SET_DOCTOR_MEDICAL_SPECIALTY",
              data.education.medical_specialty
            );
            commit(
              "SET_DOCTOR_DOCTOR_SPECIALTY",
              data.education.doctor_specialty
            );
            commit(
              "SET_DOCTOR_YEARS_OF_EDUCATION",
              data.education.years_of_education
            );
            commit("SET_DOCTOR_INTERNSHIP", data.education.internship);
            commit("SET_DOCTOR_RESIDENCY", data.education.residency);
            if (data.user.photo) {
              dispatch("uploadDoctorImage", data.user.photo);
            }
            commit("SET_FELLOW_STUDENT", {
              id: 1,
              value: data.education.fellowStudent1,
            });
            commit("SET_FELLOW_STUDENT", {
              id: 2,
              value: data.education.fellowStudent2,
            });
          });
        });
      }
      commit("SET_AUTH_STATUS", false);
      dispatch(
        "alerts/addAlert",
        {
          type: "error",
          text: rootState.lang.common["Email taken"]
            ? rootState.lang.common["Email taken"]
            : "Email taken",
        },
        { root: true }
      );
    });
  },
  login({ commit, dispatch, rootState }, { login, password }) {
    return axios
      .post(api.doctorLogin, { login, password })
      .then(async (res) => {
        if (res.data.status === "error" || res.data.data.profile.role !== 100) {
          dispatch(
            "alerts/addAlert",
            {
              type: "error",
              text: rootState.lang.common["Credentials error"]
                ? rootState.lang.common["Credentials error"]
                : "Credentials error",
            },
            { root: true }
          );
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
        dispatch("fetchDoctorProfile");
        router.push({ name: "Dashboard" });
      });
  },
  confirmLogin({ commit, dispatch }, login) {
    return axios
      .get(api.confirmLogin, { params: { login } })
      .then(async (res) => {
        if (!res.data.data) {
          return res.data.data;
        }
        commit("SET_AUTH_STATUS", true);
        return res.data.data;
      });
  },
  fetchUserProfile({ state, commit, dispatch, rootState }) {
    return axios.get(api.getUserProfile).then((res) => {
      try {
        if (res.data.profile.role !== 100) throw Error;
        commit("SET_USER_PROFILE", res.data.profile);
        dispatch("fetchLangItems", {
          lang: res.data.profile.lang,
          type: "common",
        });
        dispatch("fetchLangItems", {
          lang: res.data.profile.lang,
          type: "doctor",
        });
      } catch (err) {
        const errorText = rootState.lang.common["Profile not found"]
          ? rootState.lang.common["Profile not found"]
          : "Profile not found";
        const systemLang = res.data.profile.lang;
        commit("SET_AUTH_STATUS", false);
        dispatch(
          "alerts/addAlert",
          {
            text: errorText,
            type: "error",
          },
          { root: true }
        );
        dispatch("logout", systemLang.toLowerCase());
      }
    });
  },
  fetchDoctorProfile({ commit }) {
    return axios.get(api.getDoctorProfile).then((res) => {
      commit("SET_DOCTOR_PROFILE", res.data.data);
    });
  },
  logout({ commit }, lang = "en") {
    commit("SET_AUTH_STATUS", false);
    commit("SET_USER_PROFILE", null);
    window.localStorage.clear();
    router.push({ name: "Login", params: { lang } });
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
  updateDoctorProfile({ commit, state }) {
    console.log("saving...");
    commit("SET_IS_PROFILE_UPDATING", true);
    const profile = _.cloneDeep(state.doctorProfile);
    profile.info = JSON.stringify(profile.info);
    return axios.post(api.postDoctorProfile, profile).then((res) => {
      console.log("saved");
      setTimeout(() => {
        commit("SET_IS_PROFILE_UPDATING", false);
      }, 2000);
    });
  },
  uploadDoctorImage({ dispatch, commit }, data) {
    return axios.post(api.postImage, data).then((res) => {
      commit("SET_DOCTOR_PHOTO", res.data.data.file);
    });
  },
  getCountryCode() {
    return plainAxios.get("http://ip-api.com/json").then((res) => {
      return res.data.countryCode;
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
