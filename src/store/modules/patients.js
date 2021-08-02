import { axios, api } from "./../../config";

const state = {
  patients: [],
  selectedPatient: null,
  selectedPatientClinicalRecords: null,
};
const getters = {
  getRecordById: (state) => (id) => {
    return state.selectedPatientClinicalRecords.find(
      (record) => record.id === id
    );
  },
};
const mutations = {
  SET_PATIENTS(state, payload) {
    state.patients = payload;
  },
  SET_SELECTED_PATIENT(state, payload) {
    try {
      const anamnesis = JSON.parse(payload.anamnesis);
      if (!anamnesis) throw Error;
      payload.anamnesis = anamnesis;
      state.selectedPatient = payload;
    } catch (err) {
      payload.anamnesis = {};
      // anamnesis
      payload.anamnesis.generalAnamnesis = {}
      payload.anamnesis.generalAnamnesis['Complaints'] = [];
      payload.anamnesis.generalAnamnesis['Drugs taken'] = [];
      payload.anamnesis.generalAnamnesis['Allergies'] = [];
      state.selectedPatient = payload;


      // lifeAnamnesis
      payload.anamnesis.lifeAnamnesis = {}
      payload.anamnesis.lifeAnamnesis['Chronic diseases'] = []
      payload.anamnesis.lifeAnamnesis['Injuries'] = []
      payload.anamnesis.lifeAnamnesis['Operations'] = []
      payload.anamnesis.lifeAnamnesis['Bad habits'] = []
      payload.anamnesis.lifeAnamnesis['Blood transfusion'] = []
      payload.anamnesis.lifeAnamnesis['Heredity'] = []
      payload.anamnesis.lifeAnamnesis['Medications'] = []
      payload.anamnesis.lifeAnamnesis['Diet'] = []

      // allergicAnamnesis: {
      payload.anamnesis.allergicAnamnesis = {}
      payload.anamnesis.allergicAnamnesis['Allergies to medicinal substances'] = []
      payload.anamnesis.allergicAnamnesis['Food allergy'] = []
      payload.anamnesis.allergicAnamnesis['Household allergies'] = []

      // objectiveAnamnesis
      payload.anamnesis.objectiveAnamnesis = {}
      payload.anamnesis.objectiveAnamnesis['General anamnesis'] = []
      payload.anamnesis.objectiveAnamnesis['Local anamnesis'] = []
      
      // surveys
      payload.anamnesis.surveys = {}
      payload.anamnesis.surveys['Laboratory surveys'] = []
      payload.anamnesis.surveys['Hardware and instrumental surveys'] = []
    }
  },
  SET_CLINICAL_RECORDS(state, payload) {
    state.selectedPatientClinicalRecords = payload;
  },
  SORT_PATIENTS(state, query) {
    switch (query) {
      case "date":
        state.patients.sort((a, b) => (a.createdon < b.createdon ? 1 : -1));
        break;
      case "alphabet":
        state.patients.sort((a, b) =>
          a.name.split(" ")[0] < b.name.split(" ")[0] ? -1 : 1
        );
        break;
    }
  },
};
const actions = {
  fetchPatients({ commit }) {
    return axios.get(api.getPatients).then((res) => {
      commit("SET_PATIENTS", res.data.data);
    });
  },
  fetchSelectedPatient({ commit }, id) {
    return axios.get(api.getSelectedPatient + `/${id}`).then((res) => {
      commit("SET_SELECTED_PATIENT", res.data.data);
    });
  },
  createNewPatient({ dispatch }, data) {
    return axios.post(api.createNewPatient, data).then((res) => {
      dispatch("fetchPatients");
    });
  },
  sortPatientsBy({ commit }, query) {
    commit("SORT_PATIENTS", query);
  },
  addClinicalRecord({ dispatch }, data) {
    return axios.post(api.postClinicalRecords, data).then(() => {
      dispatch("fetchPatientClinicalRecordsById", data.patient_id);
    });
  },
  addAnamnesis({ dispatch }, { id, anamnesis }) {
    return axios.post(api.updatePatient, { id, anamnesis }).then(() => {
      dispatch("fetchSelectedPatient", id);
    });
  },
  fetchPatientClinicalRecordsById({ commit }, id) {
    return axios
      .get(`${api.getClinicalRecords}?filters={"patient_id": ${id}}`)
      .then((res) => {
        commit("SET_CLINICAL_RECORDS", res.data.data);
      });
  },  
  uploadFile({ commit }, file) {
    return axios.post(api.postFile, file).then((res) => {
      console.log(res)
    })
  },
  fetchUploadedFile({ commit }) {

  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
