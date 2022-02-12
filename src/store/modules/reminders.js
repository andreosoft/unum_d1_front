/** @format */

import { axios, api } from '../../config';
import dayjs from 'dayjs';
export default {
  namespaced: true,

  state: {
    reminders: null,
    reminder: {},
  },
  getters: {
    reminderBySource: (state) => (prop) => {
      let reminder = state.reminders.find((el) => {
        if (el.sourceName == prop.name && el.sourceId == prop.id) {
          return true;
        } else {
          return false;
        }
      });
      console.log('reminderBySource', reminder, prop, state.reminders);
      return reminder || {};
    },
  },
  mutations: {
    SET_REMINDERS(state, payload) {
      //    state.reminders = payload;
      state.reminders = [];
      payload.forEach((el) => {
        try {
          let reminder = JSON.parse(el.data);
          reminder.id = el.id;
          state.reminders.push(reminder);
        } catch (e) {}
      });
      console.log('SET_REMINDERS', payload, state.reminders);
    },
  },
  actions: {
    /*   fetchReminderBySource({ commit }, prop) {
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
    },*/
    fetchReminders({ commit }) {
      /*    let reminders = [];
      if (localStorage.getItem('LocalUserReminders')) {
        reminders = JSON.parse(localStorage.getItem('LocalUserReminders'));
        console.log('fetchReminders', reminders);
      }*/
      //reminders = [];
      // commit('SET_REMINDERS', reminders);
      return axios.get(api.userReminder, { params: { filters: { user_id: 125 } } }).then((res) => {
        if (res?.data?.data) {
          commit('SET_REMINDERS', res.data.data);
        }
      });
    },
    updateReminder({ dispatch, state }, data) {
      let id = data?.id;
      let user_id = data?.userId;
      delete data.id;
      delete data.userId;
      return axios.post(api.userReminder, { id, name: 'samples', user_id, date_event: data.date, data: JSON.stringify(data) }).then((res) => {
        // response handling
        dispatch('fetchReminders');
      });

      return axios.post(api.userReminder, data).then((res) => {
        // response handling
        dispatch('fetchReminders');
      });
    },

    /*    updateReminders({ dispatch, state }, data) {
      if (!state.reminder) {
        dispatch('fetchReminders');
      }
      let reminders = state.reminders || [];
      //reminders = [];
      let idx;
      let duration = data.reminder.map((el) => {
        return dayjs(el.includes('d') ? dayjs(data.date).startOf('day') : data.date)
          .add(eval(el.replace('d', '*24').replace('h', '')) * -1, 'hour')
          .format('YYYY-MM-DD HH:mm:ss');
      });
      data.duration = duration;
      console.log('updateReminders', data, reminders);

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
      dispatch('fetchReminders');
    },*/
  },
};
