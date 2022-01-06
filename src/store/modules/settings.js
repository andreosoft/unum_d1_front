/** @format */

import { axios, api } from './../../config';
export default {
  namespaced: true,

  state: {
    samples: null,
    servicesList: null,
    scheduleBasic: null,
    defaults: {
      servicesList: [],
      scheduleBasic: { defaultTime: 60, defaultView: 'month' },
    },
  },
  getters: {
    getSamples: (state) => (model) => {
      if (!model) return state.samples && state.samples;
      let ss = '';
      return state.samples && state.samples[model.toLowerCase()];
    },
    getCurrentBasis: (state) => {
      let res = {};
      for (let k of Object.keys(state.defaults.scheduleBasic)) {
        res[k] = state.scheduleBasic[k] || state.defaults.scheduleBasic[k];
      }
      return res;
    },
    getPalette: (state) => {
      return state.scheduleBasic?.userPalette || state.defaults.scheduleBasic?.userPalette || null;
    },
  },
  mutations: {
    SET_SAMPLES(state, payload) {
      state.samples = payload;
    },
    SET_SERVICES_LIST(state, payload) {
      state.servicesList = payload;
    },
    SET_SCHEDULE_BASIC(state, payload) {
      state.scheduleBasic = payload;
    },
  },
  actions: {
    fetchSamples({ commit }) {
      let samples = [];
      if (localStorage.getItem('LocalUserSamples')) {
        samples = JSON.parse(localStorage.getItem('LocalUserSamples'));
      }
      commit('SET_SAMPLES', samples);
    },
    updateSamples({ dispatch, state }, data) {
      let model = data[1];
      if (!model) return;
      let k = '';
      k = JSON.parse(JSON.stringify(model.toLowerCase()));
      let samples = state.samples;
      if (!samples.hasOwnProperty(k)) {
        samples = Object.assign({}, samples, { [k]: [] });
      }
      samples[k] = data[0];
      localStorage.setItem('LocalUserSamples', JSON.stringify(samples));
      dispatch('fetchSamples');
    },
    fetchServicesList({ commit }) {
      let services = [];
      if (localStorage.getItem('LocalUserServicesList')) {
        services = JSON.parse(localStorage.getItem('LocalUserServicesList'));
      }
      console.log('fetchServicesList', services);
      commit('SET_SERVICES_LIST', services);
    },
    updateServicesList({ dispatch, state }, data) {
      localStorage.setItem('LocalUserServicesList', JSON.stringify(data));
      console.log('updateServicesList', data);
      dispatch('fetchServicesList');
    },
    fetchScheduleBasic({ commit }) {
      //let data = { defaultTime: 60, defaultView: 'month', userPalette: [] };
      let data = {};
      if (localStorage.getItem('LocalUserScheduleBasic')) {
        data = JSON.parse(localStorage.getItem('LocalUserScheduleBasic'));
      }
      console.log('fetchScheduleBasic', data);
      commit('SET_SCHEDULE_BASIC', data);
    },
    updateScheduleBasic({ dispatch, state }, data) {
      localStorage.setItem('LocalUserScheduleBasic', JSON.stringify(data));
      dispatch('fetchScheduleBasic');
    },
  },
};
