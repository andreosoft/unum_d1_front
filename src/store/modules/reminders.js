/** @format */

import { axios, api } from '../../config';
export default {
  namespaced: true,

  state: {
    reminders: null,
    reminder: {},
  },
  getters: {
    reminderBySource: (state) => (prop) => {
      console.log('reminderBySource', prop);
      let reminder = state.reminders.find((el) => {
        if (el.sourceName == prop.name && el.sourceId == prop.id) {
          return true;
        } else {
          return false;
        }
      });
      return reminder || {};
    },
  },
  mutations: {
    SET_REMINDERS(state, payload) {
      state.reminders = payload;
    },
  },
  actions: {
    fetchReminderBySource({ commit }, prop) {
      let reminders = [];
      let reminder = {};
      if (localStorage.getItem('LocalUserReminders')) {
        reminders = JSON.parse(localStorage.getItem('LocalUserReminders'));
        if (prop) {
          reminder = reminders.find((el) => {
            if (el.source && JSON.parse(el.source).name == prop.name && JSON.parse(el.source).id == prop.id) {
              return true;
            } else {
              return false;
            }
          });
        }
      }
      commit('SET_REMINDER', reminder);
    },
    fetchReminders({ commit }) {
      let reminders = [];
      if (localStorage.getItem('LocalUserReminders')) {
        reminders = JSON.parse(localStorage.getItem('LocalUserReminders'));
        console.log('fetchReminders', reminders);
      }
      commit('SET_REMINDERS', reminders);
    },
    updateReminders({ dispatch, state }, data) {
      if (!state.reminder) {
        dispatch('fetchReminders');
      }
      let reminders = state.reminders || [];

      console.log('updateReminders', data, reminders);
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
