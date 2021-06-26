<template>
  <div class='main-layout'>
    <v-app-bar :color="'lighten-2'" id="app-bar" fixed app flat height="60">
      <v-icon class="mr-2" @click="drawer = !drawer">mdi-menu</v-icon>
      <v-toolbar-title>{{ getTitle }}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      left
      mobile-breakpoint="960"
      color="rgb(4, 49, 78)"
      dark
      app
      width="260"
    >
      <v-list class="d-flex pa-4">
        <v-list-item
          class="pa-0 rounded-lg"
          style="overflow: hidden;"
          link
          :to="{ name: 'Profile' }"
        >
          <v-list-item-avatar color="rgb(80, 49, 101)">
            <v-icon>mdi-account</v-icon>
            <!-- <v-img :src="doctorProfile.photo"></v-img> -->
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ userProfile && userProfile.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ userProfile && userProfile.login }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list class="py-5">
        <v-list-item
          v-for="(link, index) in navLinks"
          :key="index"
          link
          :to="{ name: link.name }"
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-btn color="primary" @click="logout">
              {{ common["Sign Out"] || "выйти" }}
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <router-view></router-view>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";
const { mapState, mapActions } = createNamespacedHelpers("auth");
const { mapActions: Actions_patients } = createNamespacedHelpers("patients");
const { mapActions: Actions_doctors } = createNamespacedHelpers("doctors");
const { mapActions: Actions_events } = createNamespacedHelpers("events");
const { mapState: State_lang } = createNamespacedHelpers("lang");
export default {
  data() {
    return {
      drawer: this.$vuetify.breakpoint.mdAndUp,
    };
  },
  computed: {
    ...mapState(["userProfile", "doctorProfile"]),
    ...State_lang(["doctor", "common"]),
    navLinks() {
      const links = [
        {
          name: "Dashboard",
          title: this.common["Home"],
          icon: "mdi-view-dashboard",
        },
        {
          name: "Doctors",
          title: this.common["Doctors"],
          icon: "mdi-doctor",
        },
        {
          name: "Patients",
          title: this.doctor["Patients"],
          icon: "mdi-account-group",
        },
        {
          name: "Schedule",
          title: this.doctor["Schedule"]
            ? this.doctor["Schedule"]
            : "расписание",
          icon: "mdi-calendar",
        },
      ];
      return links;
    },
    getTitle() {
      let title = "";
      switch (this.$route.name) {
        case "Dashboard":
          title = this.common["Home"];
          break;
        case "Doctors":
          title = this.common["Doctors"];
          break;
        case "Doctor":
          title = "Врач";
          break;
        case "Patients":
          title = this.doctor["Patients"];
          break;
        case "Patient":
          title = "Пациент";
          break;
        case "Schedule":
          title = this.doctor["Schedule"];
          break;
        case "Profile":
          title = this.common["My profile"];
          break;
      }

      return title;
    },
  },
  methods: {
    ...mapActions(["logout"]),
    ...Actions_patients(["fetchPatients"]),
    ...Actions_doctors(["fetchDoctors"]),
    ...Actions_events(["fetchEvents"]),
    // ...Actions_lang(["fetchLangItems"]),
  },
  created() {
    this.fetchPatients();
    this.fetchDoctors();
    const start = dayjs()
      .startOf("month")
      .format("YYYY-MM-DD");
    const end = dayjs()
      .endOf("month")
      .format("YYYY-MM-DD");
    this.fetchEvents({ start, end });
  },
};
</script>

<style scoped>
.main-layout {
  height: 100%;
}
</style>
