<template>
  <v-container fluid class="pb-0">
    <v-row class="mb-0">
      <v-col
        v-if="$vuetify.breakpoint.mdAndUp"
        cols="3"
        class="d-flex align-items-center flex-column"
      >
        <DoctorBio
          :avatarUrl="selectedDoctor && selectedDoctor.photo"
          :firstName="getFirstName"
          :lastName="getLastName"
          :middleName="getMiddleName"
          :doctorSpecialty="selectedDoctor && selectedDoctor.medical_specialty"
        />
      </v-col>
      <v-divider vertical></v-divider>
      <v-col :cols="$vuetify.breakpoint.mdAndUp ? 9 : 12">
        <DoctorInfo
          :firstName="getFirstName"
          :lastName="getLastName"
          :country="selectedDoctor && selectedDoctor.country"
          :doctorSpecialty="selectedDoctor && selectedDoctor.medical_specialty"
          :doctorUniversity="
            selectedDoctor && selectedDoctor.medical_university
          "
          @openDrawer="drawer = true"
        />
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="drawer"
      app
    >
      <DoctorBio
        :avatarUrl="selectedDoctor && selectedDoctor.photo"
        :firstName="getFirstName"
        :lastName="getLastName"
        :middleName="getMiddleName"
        :doctorSpecialty="selectedDoctor && selectedDoctor.medical_specialty"
        class="mx-auto pt-3"
      />
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import DoctorProfileAvatar from "./DoctorProfileAvatar.vue";
import DoctorBio from "./DoctorBio.vue";
import DoctorInfo from "./DoctorInfo.vue";
const { mapState, mapGetters, mapActions } = createNamespacedHelpers("doctors");
export default {
  components: {
    DoctorProfileAvatar,
    DoctorBio,
    DoctorInfo,
  },
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    ...mapState(["selectedDoctor"]),
    ...mapGetters(["imageSrc"]),
    getFirstName() {
      return this.selectedDoctor && this.selectedDoctor.name.split(" ")[1];
    },
    getLastName() {
      return this.selectedDoctor && this.selectedDoctor.name.split(" ")[0];
    },
    getMiddleName() {
      return this.selectedDoctor && this.selectedDoctor.name.split(" ")[2];
    },
  },
  methods: {
    ...mapActions(["fetchSelectedDoctor"]),
  },
  created() {
    this.fetchSelectedDoctor(this.$route.params.id);
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
.row {
  height: 100%;
}
</style>
