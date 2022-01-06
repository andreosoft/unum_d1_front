<template>
  <div>
    <v-layout wrap row pa-2>
      <v-flex xs12 order-xs3 order-sm3 order-md1 ref="patientsList">
        <div v-if="patients.length">
          <h2 class="mx-3">{{ $t("My patients") }}</h2>
          <PatientsCardList :patients="patientsList" />
        </div>
        <div v-else>
          <h2 class="mx-3">{{ $t("No patients yet") }}</h2>
        </div>
      </v-flex>
      <v-flex lg9 md8 sm8 order-xs2 order-sm2 order-md2>
        <div v-if="events.length">
          <h2 class="mx-3">{{ $t("My events") }}</h2>
          <Events :events="getValidEvents" ref="events" />
        </div>
        <div v-else>
          <h2 class="mx-3">{{ $t("No events yet") }}</h2>
        </div>
      </v-flex>
      <v-flex lg3 md4 sm4 order-xs1 order-sm1 order-md3 ref="reminder">
        <div>
          <h2 class="mx-3">{{ $t("Reminders") }}</h2>
          <Reminders />
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import PatientsCardList from "@/components/patient/PatientCardList.vue";
import dayjs from "dayjs";

export default {
  name: "Home2",

  components: {
    PatientsCardList,
    Events: () => import("@/components/EventsCard"),
    Reminders: () => import("@/components/RemindersCard"),
  },
  data() {
    return {};
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
  mounted() {
    console.log("query home events");
    this.$store.dispatch("events/fetchEvents", {
      start: dayjs().format("YYYY-MM-DD"),
      end: dayjs().add(30, "day").format("YYYY-MM-DD"),
    });
    /* this.$axios
      .get("/doctor/schedule", {
        params: {
          start: dayjs().format("YYYY-MM-DD"),
          end: dayjs().add(30, "day").format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.e = res.data.data.filter((event) => event.type_id === 1);
      }); */
  },
  computed: {
    ...mapState({
      patients: (state) => state.patients.patients,
      events: (state) => state.events.events,
    }),
    ...mapGetters("events", ["getValidEvents"]),
    patientsList() {
      let n = 4;
      if (this.$vuetify.breakpoint.sm) n = 3;
      if (this.$vuetify.breakpoint.lg) n = 6;

      return this.patients.slice(0, n);
    },
  },
  methods: {},
};
</script>
