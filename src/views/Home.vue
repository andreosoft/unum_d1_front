<template>
  <div>
    <div v-if="patients.length">
      <h2 class="mx-3">{{ getDoctorTranslation("My patients") }}</h2>
      <PatientsCardList :patients="patients.slice(0, 4)" />
    </div>
    <div v-else>
      <h2 class="mx-3">{{ getDoctorTranslation("No patients yet") }}</h2>
    </div>
    <v-divider></v-divider>
    <div v-if="events.length">
      <h2 class="mx-3">{{ getDoctorTranslation("My events") }}</h2>
      <Events :events="getAppointments" />
    </div>
    <div v-else>
      <h2 class="mx-3">{{ getDoctorTranslation("No events yet") }}</h2>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("patients");
import PatientsCardList from "./../components/patient/PatientCardList.vue";
import Events from "./../components/Events.vue";
import dayjs from "dayjs";

const {
  mapState: State_events,
  mapGetters: Getters_events,
} = createNamespacedHelpers("events");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");
export default {
  name: "Home",

  components: {
    PatientsCardList,
    Events,
  },
  filters: {
    getDate(value) {
      return dayjs(value.split(" ")[0]).format("YYYY MMM DD");
    },
    getTime(value) {
      const time = value.split(" ")[1];

      return time.substr(0, 5);
    },
  },
  computed: {
    ...mapState(["patients"]),
    ...State_events(["events"]),
    ...Getters_events(["getAppointments"]),
    ...Getters_lang(["getDoctorTranslation"]),
  },
};
</script>
