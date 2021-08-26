import { axios, api } from "./../../config";

const state = {
  doctors: [],
  selectedDoctor: null,
};
const getters = {
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
      return "";
    }
  },
};
const mutations = {
  SET_DOCTORS(state, payload) {
    payload.map((doctor) => {
      doctor.info = JSON.parse(doctor.info);
    });
    state.doctors = payload;
  },
  SET_SELECTED_DOCTOR(state, payload) {
    state.selectedDoctor = payload;
  },
};
const actions = {
  fetchDoctors({ commit }) {
    return axios.get(api.getDoctors).then((res) => {
      commit("SET_DOCTORS", res.data.data);
    });
  },
  fetchSelectedDoctor({ commit }, id) {
    return axios.get(api.getSelectedDoctor + `/${id}`).then((res) => {
      commit("SET_SELECTED_DOCTOR", res.data.data);
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
