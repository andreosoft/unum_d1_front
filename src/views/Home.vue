<template>
  <div>
    <div v-if="patients.length">
      <h2 class="mx-3">{{ $t("My patients") }}</h2>
      <PatientsCardList :patients="patients.slice(0, 6)" />
    </div>
    <div v-else>
      <h2 class="mx-3">{{ $t("No patients yet") }}</h2>
    </div>
    <v-divider></v-divider>
    <v-layout>
      <v-flex>
        <div v-if="events.length">
          <h2 class="mx-3">{{ $t("My events") }}</h2>
          <Events :events="events" />
        </div>
        <div v-else>
          <h2 class="mx-3">{{ $t("No events yet") }}</h2>
        </div>
      </v-flex>
      <v-flex>
        <div>
          <h2 class="mx-3">{{ $t("Reminders") }}</h2>
          <Reminders :reminders="events" />
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PatientsCardList from "@/components/patient/PatientCardList.vue";
import dayjs from "dayjs";

export default {
  name: "Home",

  components: {
    PatientsCardList,
    Events: () => import("@/components/EventsCard"),
    Reminders: () => import("@/components/RemindersCard"),
  },
  data() {
    return { e: [] };
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
    this.$axios
      .get("/doctor/schedule", {
        params: {
          start: dayjs().format("YYYY-MM-DD"),
          end: dayjs().add(30, "day").format("YYYY-MM-DD"),
        },
      })
      .then((res) => {
        this.e = res.data.data.filter((event) => event.type_id === 1);
      });
  },
  computed: {
    ...mapState({ patients: (state) => state.patients.patients }),
    events() {
      return this.e;
    },
  },
};
</script>
