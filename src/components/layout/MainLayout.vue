<template>
  <div class="main-layout" ref="mainLayout">
    <v-app-bar
      v-if="
        $vuetify.breakpoint.smAndDown ? !$route.meta.hideMobileTopNavbar : true
      "
      :color="'lighten-2'"
      id="app-bar"
      fixed
      app
      flat
      height="60"
      ref="mainBar"
    >
      <div class="d-flex">
        <v-icon class="mr-2" @click="drawer = !drawer">mdi-menu</v-icon>

        <v-icon class="mr-2" @click="goUp" v-if="$route.meta.goUp"
          >mdi-arrow-left</v-icon
        >
        <v-toolbar-title>{{ getTitle }}</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>
      <portal-target name="toolbar-action"></portal-target>
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
          style="overflow: hidden"
          link
          :to="{ name: 'Profile' }"
        >
          <v-list-item-avatar color="rgb(80, 49, 101)">
            <v-icon v-if="!getPhoto">mdi-account</v-icon>
            <v-img v-else :src="getPhoto"></v-img>
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

      <v-list class="py-5 nav-links__list">
        <v-list-item
          v-for="(link, index) in navLinks"
          :key="index"
          link
          :to="{ name: link.name }"
          :exact="link.name === 'Dashboard'"
          class="nav-links__item"
          v-if="!link.hide"
        >
          <v-list-item-icon class="ml-0">
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-badge v-if="link.notification">
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-badge>
          <v-list-item-title v-else>{{ link.title }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-btn color="primary" @click="logout('en')">
              {{ $t("Sign out") }}
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <div>{{ packageVersion }}</div>
        </div>
      </template>
    </v-navigation-drawer>

    <router-view></router-view>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";

import { version } from "./../../../package";

const { mapState, mapActions } = createNamespacedHelpers("auth");
const { mapActions: Actions_patients } = createNamespacedHelpers("patients");
const { mapActions: Actions_doctors } = createNamespacedHelpers("doctors");
const { mapActions: Actions_events } = createNamespacedHelpers("events");
const { mapActions: Chats_events } = createNamespacedHelpers("chats");
const { mapState: State_lang, mapGetters: Getters_lang } =
  createNamespacedHelpers("lang");
export default {
  data() {
    return {
      drawer: this.$vuetify.breakpoint.mdAndUp,
    };
  },
  computed: {
    ...mapState(["userProfile", "doctorProfile", "doctorProfileFetched"]),
    ...State_lang(["doctor", "common"]),
    ...Getters_lang(["getCommonTranslation", "getDoctorTranslation"]),
    packageVersion() {
      return version;
    },
    navLinks() {
      const links = [
        {
          name: "Dashboard",
          title: this.getCommonTranslation("Home"),
          icon: "mdi-view-dashboard",
        },
        {
          name: "Chats",
          title: this.getCommonTranslation("Chats"),
          icon: "mdi-message-text",
          notification: this.$root.chatsNotification,
        },
        {
          name: "Consilliums",
          title: this.getCommonTranslation("Consilliums"),
          icon: "mdi-forum",
          notification: this.$root.consiliumNotification,
          hide: true,
        },
        {
          name: "Doctors",
          title: this.getCommonTranslation("Doctors"),
          icon: "mdi-doctor",
        },
        {
          name: "Patients",
          title: this.getDoctorTranslation("Patients"),
          icon: "mdi-account-group",
        },
        {
          name: "Schedule",
          title: this.getDoctorTranslation("Schedule"),
          icon: "mdi-calendar",
        },
        {
          name: "Settings",
          title: this.$t("Settings"),
          icon: "mdi-cog-outline",
        },
      ];
      return links;
    },
    getTitle() {
      /* let title = "";
      switch (this.$route.name) {
        case "Dashboard":          title = this.getCommonTranslation("Home");
        case "Chats":          title = this.getCommonTranslation("Chats");
        case "Chat":          title = this.getCommonTranslation("Chat");
        case "Consillium":          title = this.getCommonTranslation("Consillium");
        case "Consilliums":          title = this.getCommonTranslation("Consilliums");
        case "Doctors":          title = this.getCommonTranslation("Doctors");
        case "Doctor":          title = this.getCommonTranslation("Doctor");
        case "Patients":          title = this.getDoctorTranslation("Patients");
        case "Patient":          title = this.getCommonTranslation("Outpatient Card");
        case "Schedule":          title = this.getDoctorTranslation("Schedule");
        case "Profile":          title = this.getCommonTranslation("My profile");
        case "New patient":          title = this.getDoctorTranslation("New patient");
        default:          title = this.$t(this.$route.name);
      }
 */
      return this.$t(
        this.$route.params?.desc || this.$route.meta?.title || this.$route.name
      );
    },
    getPhoto() {
      return (
        this.doctorProfile &&
        this.doctorProfile.photo &&
        `http://api.neomedy.com/api/image/download/${this.doctorProfile.photo}`
      );
    },
  },
  methods: {
    ...mapActions(["logout"]),
    ...Actions_patients(["fetchPatients"]),
    ...Actions_doctors(["fetchDoctors"]),
    ...Actions_events(["fetchEvents"]),
    ...Chats_events(["fetchChats"]),
    goUp() {
      var upperPath = this.$route.path.split("/");
      if (upperPath.length > 2) {
        upperPath.splice(upperPath.length - 1);
        this.$router.push(upperPath.join("/"));
      } else {
        this.$router.push("/");
      }
    },
  },
  created() {
    this.fetchPatients();
    this.fetchDoctors();
    this.fetchChats();
    const start = dayjs().startOf("month").format("YYYY-MM-DD");
    const end = dayjs().endOf("month").format("YYYY-MM-DD");
    this.fetchEvents({ start, end });
  },
};
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100%;
}
.v-list-item__title {
  white-space: normal;
}
.nav-links__item {
  .v-list-item__title {
    font-size: 1.2rem;
    // font-family: Exo 2;
  }
}
.v-list-item__subtitle {
  font-weight: 300;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
