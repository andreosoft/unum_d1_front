/** @format */

import { axios, api } from '../../config';
export default {
  namespaced: true,

  state: {
    reminders: null,
  },
  getters: {},
  mutations: {
    SET_REMINDERS(state, payload) {
      state.reminders = payload;
    },
  },
  actions: {
    fetchReminders({ commit }) {
      let reminders = [];
      if (localStorage.getItem('LocalUserReminders')) {
        reminders = JSON.parse(localStorage.getItem('LocalUserReminders'));
      }
      commit('SET_REMINDERS', reminders);
    },
    updateReminders({ dispatch, state }, data) {
      let reminders = state.reminders;
      let idx;
      if (data?.id) {
        idx = reminders.findIndex((el) => {
          return el.id === data.id;
        });
        if (idx) {
          reminders[idx] = data;
        } else {
          reminders.push(data);
        }
      } else {
        reminders.push(data);
      }
      localStorage.setItem('LocalUserReminders', JSON.stringify(reminders));
      console.log('LocalUserReminders', data, reminders);
      dispatch('fetchReminders');
    },
  },
};
