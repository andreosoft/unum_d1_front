/** @format */

import { axios, api } from './../../config';
export default {
  namespaced: true,

  state: {
    doctors: [],
    selectedDoctor: null,
    samples: null,
  },
  getters: {
    getDoctorName: (state) => (doctorId) => {
      const doctor = state.doctors.filter((doc) => doc.id === doctorId);
      if (doctor.length) {
        return doctor[0].name;
      }
      return undefined;
    },
    imageSrc() {
      return (id) => api.getImage + `/${id}`;
    },
    getDoctorSpecialty: (state) => (doctorId) => {
      const doctor = state.doctors.filter((doc) => doc.id === doctorId);
      try {
        if (!doctor[0] || !doctor[0].info.doctor_specialty) throw Error;
        return doctor[0].info.doctor_specialty;
      } catch (err) {
        return '';
      }
    },
    getDoctorByUserId: (state) => (userId) => {
      return state.doctors && state.doctors.find((doc) => doc.user_id === userId);
    },
    getSamples: (state) => (model) => {
      if (!model) return state.samples && state.samples;
      let ss = '';
      return state.samples && state.samples[model.toLowerCase()];
    },
  },
  mutations: {
    SET_DOCTORS(state, payload) {
      payload.map((doctor) => {
        doctor.info = JSON.parse(doctor.info);
      });
      state.doctors = payload;
    },
    SET_SELECTED_DOCTOR(state, payload) {
      state.selectedDoctor = payload;
    },
    SET_SAMPLES(state, payload) {
      state.samples = payload;
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
    fetchDoctors({ commit }) {
      return axios.get(api.getDoctors).then((res) => {
        commit('SET_DOCTORS', res.data.data);
      });
    },
    fetchSelectedDoctor({ commit }, id) {
      return axios.get(api.getSelectedDoctor + `/${id}`).then((res) => {
        commit('SET_SELECTED_DOCTOR', res.data.data);
      });
    },
    fetchDocSpecialtiesOnInput(_, string) {
      return axios.get(api.getDoctorSpecialty + `/${string}`).then((res) => res.data.data);
    },
    fetchDiseaseByCodeOnInput(_, code) {
      return axios.get(api.getDiseaseByCode + `/${code}`).then((res) => {
        return res.data.data;
      });
    },
    fetchDiseaseByNameOnInput(_, name) {
      return axios.get(api.getDiseaseByName + `/${name}`).then((res) => {
        return res.data.data;
      });
    },
    fetchUniversity(_, name) {
      return axios.get(api.getUniversity + `/${name}`).then((res) => {
        return res.data.data;
      });
    },
  },
};
