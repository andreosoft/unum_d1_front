/** @format */

import { axios, api } from './../../config/index';
import dayjs from 'dayjs';

const state = {
  events: [],
};

const getters = {
  getAppointments(state) {
    return state.events.filter((event) => event.type_id === 1);
  },
  getValidEvents(state) {
    return state.events.filter((event) => dayjs().isBefore(event.start) && event.type_id === 1);
  },
};

const mutations = {
  SET_EVENTS(state, payload) {
    state.events = payload;
  },
};

const actions = {
  fetchEvents({ commit, rootState, dispatch }, { start, end }) {
    return axios.get(api.schedule, { params: { start, end } }).then((res) => {
      const events = res.data.data;
      events.map((event) => {
        event.color ? '' : (event.color = '#CC0000');
        event.name ? '' : (event.name = event.patient);
      });
      commit('SET_EVENTS', res.data.data);
    });
  },
  createEvent({ commit }, data) {
    return axios.post(api.addDoctorSchedule, data).then((res) => {
      // response handling
      console.log(res);
    });
  },
  deleteEvent({}, id) {
    console.log('deleting...', id);
    return axios
      .delete(api.deleteScheduleItem + `/${id}`)
      .then(() => {
        console.log('deleted');
      })
      .catch((err) => {
        console.log('could not delete the event');
        console.error(err);
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
