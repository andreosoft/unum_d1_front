/** @format */

import { axios, api } from './../../config';
export default {
  namespaced: true,

  state: {
    samples: null,
    servicesList: null,
    services: null,
    scheduleBasic: null,
    defaults: {
      servicesList: [],
      scheduleBasic: { defaultTime: 60, defaultView: 'month', duration: ['1d', '2d', '3d', '5d', '7d', '1h', '2h', '3h', '5h', '7h'] },
    },
  },
  getters: {
    getSamples: (state) => (model) => {
      if (!model) return state.samples && state.samples;
      return (state.samples && state.samples.filter((sample) => sample?.target === model)) || [];
    },

    getPalette: (state) => {
      return state.scheduleBasic?.userPalette || state.defaults.scheduleBasic?.userPalette || null;
    },
    getDuration: (state) => {
      return state.scheduleBasic?.duration || state.defaults.scheduleBasic?.duration || null;
    },
  },
  mutations: {
    SET_SAMPLES(state, payload) {
      // state.samples = payload;
      state.samples = [];
      payload.forEach((el) => {
        try {
          let sample = JSON.parse(el.data);
          sample.id = el.id;
          state.samples.push(sample);
        } catch (e) {}
      });
      console.log('SET_SAMPLES', payload, state.samples);
    },
    SET_SERVICES_LIST(state, payload) {
      state.servicesList = [];
      state.services = [];
      if (payload) {
        payload.forEach((el) => {
          try {
            let service = JSON.parse(el.data);
            service.id = el.id;
            state.servicesList.push(service);
            state.services.push(service);
          } catch (e) {
            console.log('error', e);
          }
        });
      }
      console.log('SET_SERVICES_LIST', payload, JSON.parse(JSON.stringify(state.services)));
    },
    SET_SCHEDULE_BASIC(state, payload) {
      // state.scheduleBasic = payload;
      state.scheduleBasic = {};
      payload.forEach((el) => {
        try {
          let v = JSON.parse(el.data);
          v.id = el.id;
          state.scheduleBasic.push(v);
        } catch (e) {}
      });
    },
  },
  actions: {
    fetchSettings({ commit, dispatch }, name) {
      return axios.get(api.userSettings, { params: { filters: { name } } }).then((res) => {
        console.log('fetchSetting', res);
        if (res?.data?.data) {
          console.log('fetchSetting status ok');
          return res.data.data;
        }
      });
    },
    fetchSamples({ commit }) {
      let name = 'samples';
      return axios.get(api.userSettings, { params: { filters: { name } } }).then((res) => {
        console.log('fetchSamples', res);
        if (res?.data?.data) {
          console.log('fetchSamples status ok');
          commit('SET_SAMPLES', res.data.data);
        }
      });
    },
    /*   updateSamples({ dispatch, state }, data) {
      // not used
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
      return axios.post(api.userSettings, data).then((res) => {
        // response handling
        dispatch('fetchSamples');
      });
      dispatch('fetchSamples');
    },*/
    updateSample({ dispatch, state }, data) {
      console.log('updateSample', data);
      let id = data?.id;
      delete data.id;
      return axios.post(api.userSettings, { id, name: 'samples', data: JSON.stringify(data) }).then((res) => {
        // response handling
        console.log('fetchSample', res);
        dispatch('fetchSamples');
      });
    },
    deleteSample({ dispatch }, id) {
      if (!id) {
        dispatch('fetchSamples');
        return true;
      }
      return axios
        .delete(api.userSettings + `/${id}`)
        .then(() => {
          console.log('deleted');
          dispatch('fetchSamples');
        })
        .catch((err) => {
          console.log('could not delete the event');
          console.error(err);
        });
    },
    fetchServicesList({ commit, dispatch }) {
      let name = 'services_list';
      return axios.get(api.userSettings, { params: { filters: { name } } }).then((res) => {
        console.log('fetchServicesList', res);
        if (res?.data?.data) {
          console.log('fetchServicesList status ok');
          commit('SET_SERVICES_LIST', res.data.data);
        }
      });
      let services = [];
      if (localStorage.getItem('LocalUserServicesList')) {
        services = JSON.parse(localStorage.getItem('LocalUserServicesList'));
      }
      console.log('fetchServicesList', services);
      commit('SET_SERVICES_LIST', services);
    },
    updateServicesList({ dispatch, state }, data) {
      console.log('updateServicesList', data);
      let id = data?.id;
      delete data.id;
      return axios.post(api.userSettings, { id, name: 'services_list', data: JSON.stringify(data) }).then((res) => {
        // response handling
        console.log('fetchServicesList', res);
        dispatch('fetchServicesList');
      });
      localStorage.setItem('LocalUserServicesList', JSON.stringify(data));
      console.log('updateServicesList', data);
      dispatch('fetchServicesList');
    },
    fetchScheduleBasic({ commit }) {
      let name = 'schedule_basic';
      return axios.get(api.userSettings, { params: { filters: { name } } }).then((res) => {
        console.log('fetchScheduleBasic', res);
        if (res?.data?.data) {
          console.log('fetchScheduleBasic status ok');
          commit('SET_SCHEDULE_BASIC', res.data.data);
        }
      });
      //let data = { defaultTime: 60, defaultView: 'month', userPalette: [] };
      let data = {};
      if (localStorage.getItem('LocalUserScheduleBasic')) {
        data = JSON.parse(localStorage.getItem('LocalUserScheduleBasic'));
      }
      console.log('fetchScheduleBasic', data);
      commit('SET_SCHEDULE_BASIC', data);
    },
    updateScheduleBasic({ dispatch, state }, data) {
      console.log('updateScheduleBasic', data);
      let id = data?.id;
      delete data.id;
      return axios.post(api.userSettings, { id, name: 'schedule_basic', data: JSON.stringify(data) }).then((res) => {
        // response handling
        console.log('updateScheduleBasic', res);
        dispatch('fetchScheduleBasic');
      });
      localStorage.setItem('LocalUserScheduleBasic', JSON.stringify(data));
      dispatch('fetchScheduleBasic');
    },
  },
};
