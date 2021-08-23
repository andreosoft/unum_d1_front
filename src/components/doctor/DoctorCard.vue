<template>
  <v-card class="doctor__card" :elevation="hover ? 5 : 2">
    <v-responsive :aspect-ratio="4 / 3">
      <v-avatar tile class="doctor__card-avatar">
        <v-img
          style="width: 100%; height: 100%; display: block;"
          :src="
            doctor.photo
              ? `${imageSrc(doctor.photo)}?width=250&height=250`
              : '/images/doctor-placeholder.jpeg'
          "
        />
      </v-avatar>
    </v-responsive>
    <v-card-text>
      {{ doctor.name }}
    </v-card-text>
    <v-card-text>
      <span v-if="doctor.info.doctor_specialty">{{
        doctor.info.doctor_specialty
      }}</span>
      <span v-else class="grey--text text--lighten-1">{{
        getCommonTranslation("No specialty")
      }}</span>
    </v-card-text>
  </v-card>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("doctors");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");
export default {
  name: "DoctorCard",
  props: {
    doctor: {
      type: Object,
      default: () => {},
    },
    hover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["imageSrc"]),
    ...Getters_lang(["getCommonTranslation"]),
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/settings/_variables";
.doctor__card {
  cursor: pointer;
  width: 100%;
  &-avatar {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
