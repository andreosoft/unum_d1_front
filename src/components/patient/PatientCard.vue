<template>
  <v-card class="patient__card" :elevation="hover ? 5 : 2">
    <v-img
      class="patient__card-vatar"
      :aspect-ratio="1 / 1"
      :src="
        patient && patient.photo
          ? imageSrc(patient.photo)
          : '/images/patient-placeholder.jpeg'
      "
    />
    <v-card-text style="height: 65px; overflow: hidden">
      {{ patient.name }}
    </v-card-text>
  </v-card>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("doctors");
export default {
  name: "PatientCard",
  props: {
    patient: {
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
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/settings/_variables";
.patient__card {
  cursor: pointer;
  width: 100%;
  &-avatar {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
