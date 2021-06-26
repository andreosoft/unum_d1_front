import { axios, api } from "./../../config/index";

const state = {
  events: [],
};
const mutations = {
  SET_EVENTS(state, payload) {
    state.events = payload;
  },
};

const actions = {
  fetchEvents({ commit }, { start, end }) {
    return axios.get(api.schedule, { params: { start, end } }).then((res) => {
      commit("SET_EVENTS", res.data.data);
    });
  },
  createEvent({ commit }, data) {
    return axios.post(api.addDoctorSchedule, data).then((res) => {
      // response handling
    });
  },
  deleteEvent({}, id) {
    console.log("deleting...");
    return axios
      .delete(api.deleteScheduleItem + `/${id}`)
      .then(() => {
        console.log("deleted");
      })
      .catch((err) => {
        console.log("could not delete the event");
        console.error(err);
      });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
