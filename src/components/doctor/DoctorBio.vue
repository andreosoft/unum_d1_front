<template>
  <v-container class="doctor-info pa-4">
    <v-row no-gutters>
      <v-col cols="12">
        <DoctorProfileAvatar :avatarUrl="avatarUrl" />
        <div>
          <p class="mb-1 doctor-info__text">
            {{ lastName || getCommonTranslation("Surname") }}
          </p>
          <p class="mb-1 doctor-info__text">
            {{ firstName || getCommonTranslation("Name") }}
          </p>
          <p class="mb-1 doctor-info__text">
            {{ middleName || getCommonTranslation("Middle name") }}
          </p>
          <p class="mb-1" style="max-width: 200px;">
            {{ getDoctorTranslation("Medical specialty") }} -
            <span v-if="doctorSpecialty">{{ doctorSpecialty }}</span>
            <span v-else class="grey--text text--lighten-1">
              {{ getCommonTranslation("No specialty") }}
            </span>
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import DoctorProfileAvatar from "./DoctorProfileAvatar.vue";
const { mapGetters } = createNamespacedHelpers("lang");
export default {
  name: "DoctorBio",
  components: {
    DoctorProfileAvatar,
  },
  props: {
    avatarUrl: {
      type: String,
      default: "",
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    middleName: {
      type: String,
      default: "",
    },
    doctorSpecialty: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["getDoctorTranslation", "getCommonTranslation"]),
  },
};
</script>

<style lang="scss" scoped>
.doctor-info {
  width: fit-content;
  max-width: 100%;
}
.doctor-info__text {
  font-weight: 800;
}
</style>
