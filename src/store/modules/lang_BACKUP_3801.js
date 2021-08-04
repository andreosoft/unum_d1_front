import { axios, api } from "./../../config";

const state = {
  doctor: {},
  common: {},
};
const getters = {
  getDoctorTranslation: (state) => (key) => {
<<<<<<< HEAD
    return state.doctor[key] ? state.doctor[key] : `${key}`
  },
  getCommonTranslation: (state) => (key) => {
    return state.common[key] ? state.common[key] : `${key}`
=======
    return state.doctor[key] ? state.doctor[key] : `${key}`;
  },
  getCommonTranslation: (state) => (key) => {
    return state.common[key] ? state.common[key] : `${key}`;
>>>>>>> bc52a42b5d2334e5ef461851e4864e805b96fa7a
  },
};
const mutations = {
  SET_CURRENT_LANG_ITEMS(state, { data, type }) {
    state[type] = data;
  },
};
const actions = {
  fetchLangItems({ commit, state }, { lang, type }) {
    if (lang === "") lang = "ru";
    return axios.get(api.getLangItems + `/${lang}/${type}`).then((res) => {
      commit("SET_CURRENT_LANG_ITEMS", { data: res.data.data, type });
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
