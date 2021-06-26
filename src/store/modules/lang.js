import { axios, api } from "./../../config";

const state = {
  doctor: {},
  common: {},
};
const getters = {
  getDoctorTranslations(state) {
    return state.doctor
  },
  getCommonTranslations(state) {
    return state.common
  },
}
const mutations = {
  SET_CURRENT_LANG_ITEMS(state, { data, type }) {
    state[type] = data;
  },
};
const actions = {
  fetchLangItems({ commit, state }, { lang, type }) {
    if (lang === '') lang = 'ru'
    return axios.get(api.getLangItems + `/${lang}/${type}`).then((res) => {
      commit("SET_CURRENT_LANG_ITEMS", { data: res.data.data, type });
      // console.log(res.data.data)
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
