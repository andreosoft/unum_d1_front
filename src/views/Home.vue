<template>
  <div>
    <div v-if="patients.length">
      <h2 class="mx-3">{{ $t("My patients") }}</h2>
      <PatientsCardList :patients="patients.slice(0, 4)" />
    </div>
    <div v-else>
      <h2 class="mx-3">{{ $t("No patients yet") }}</h2>
    </div>
    <v-divider></v-divider>
    <v-layout>
      <v-flex>
        <div v-if="events.length">
          <h2 class="mx-3">{{ $t("My events") }}</h2>
          <Events :events="getValidEvents" />
        </div>
        <div v-else>
          <h2 class="mx-3">{{ $t("No events yet") }}</h2>
        </div>
      </v-flex>
      <v-flex>
        <div>
          <h2 class="mx-3">{{ $t("Reminders") }}</h2>
          <Reminders :reminders="getValidReminders" />
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("patients");
import PatientsCardList from "@/components/patient/PatientCardList.vue";
import dayjs from "dayjs";

const { mapState: State_events, mapGetters: Getters_events } =
  createNamespacedHelpers("events");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");
export default {
  name: "Home",

  components: {
    PatientsCardList,
    Events: () => import("@/components/EventsCard"),
    Reminders: () => import("@/components/RemindersCard"),
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
    this.$store.dispatch("events/fetchEvents", {
      start: dayjs().format("YYYY-MM-DD"),
      end: dayjs().add(30, "day").format("YYYY-MM-DD"),
    });
  },
  computed: {
    ...mapState(["patients"]),
    ...State_events(["events"]),
    ...Getters_events(["getValidEvents"]),
  },
};
</script>
