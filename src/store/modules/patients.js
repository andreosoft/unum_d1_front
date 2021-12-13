/** @format */

import { axios, api } from './../../config';

const state = {
  patients: {},
  selectedPatient: null,
  selectedPatientClinicalRecords: null,
};
const getters = {
  getRecordById: (state) => (id) => {
    return state.selectedPatientClinicalRecords.find((record) => record.id === id);
  },
  patient: (state) => {
    let res = state.selectedPatient;
    console.log('store patient getter', res);
    return state.selectedPatient;
  },
};
const mutations = {
  SET_PATIENTS(state, payload) {
    state.patients = payload;
  },
  SET_SELECTED_PATIENT(state, payload) {
    state.selectedPatient = payload;
  },
  SET_CLINICAL_RECORDS(state, payload) {
    state.selectedPatientClinicalRecords = payload;
  },
  SORT_PATIENTS(state, query) {
    switch (query) {
      case 'date':
        state.patients.sort((a, b) => (a.createdon < b.createdon ? 1 : -1));
        break;
      case 'alphabet':
        state.patients.sort((a, b) => (a.name.split(' ')[0] < b.name.split(' ')[0] ? -1 : 1));
        break;
    }
  },
};
const actions = {
  fetchPatients({ commit }) {
    return axios.get(api.getPatients).then((res) => {
      commit('SET_PATIENTS', res.data.data);
    });
  },
  fetchSelectedPatient: ({ commit }, id) => {
    return axios.get(api.getSelectedPatient + `/${id}`).then((res) => {
      commit('SET_SELECTED_PATIENT', res.data.data);
    });
  },
  createNewPatient({ dispatch }, data) {
    return axios.post(api.createNewPatient, data).then((res) => {
      dispatch('fetchPatients');
    });
  },
  sortPatientsBy({ commit }, query) {
    commit('SORT_PATIENTS', query);
  },
  addClinicalRecord({ dispatch }, data) {
    return axios.post(api.postClinicalRecords, data).then(() => {
      dispatch('fetchPatientClinicalRecordsById', data.patient_id);
    });
  },
  addAnamnesis({ dispatch }, { id, anamnesis }) {
    return axios.post(api.updatePatient, { id, anamnesis }).then(() => {
      dispatch('fetchSelectedPatient', id);
    });
  },
  fetchPatientClinicalRecordsById: ({ commit }, id) => {
    return axios.get(`${api.getClinicalRecords}?filters={"patient_id": ${id}}`).then((res) => {
      commit('SET_CLINICAL_RECORDS', res.data.data);
    });
  },
  uploadFile({ commit }, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    return axios
      .post(api.postFile, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        return res.data.data;
      });
  },
  requestPatientCardAccess({ dispatch, rootState }, email) {
    return axios
      .post(api.requestAccess, { email })
      .then((res) => {
        if (res.data.status === 'ok') {
          return dispatch(
            'alerts/addAlert',
            {
              type: 'success',
              text: rootState.lang.common['Access request sent'] ? rootState.lang.common['Access request sent'] : 'Access request sent',
            },
            {
              root: true,
            }
          );
        }
      })
      .catch(() => {
        dispatch(
          'alerts/addAlert',
          {
            type: 'error',
            text: rootState.lang.common["Email doesn't exist"] ? rootState.lang.common["Email doesn't exist"] : "Email doesn't exist",
          },
          {
            root: true,
          }
        );
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
